// Simplified versions of Playwright examples from https://applitools.com/blog/cypress-vs-playwright/

import { test, expect, Page, Locator } from '@playwright/test'

test('round1', async ({ page }) => {
    await page.goto('https://demo.applitools.com/')
    
    await page.locator('#username').fill('andy')
    await page.locator('#password').fill('panda<3')
    await page.locator('#log-in').click()

    await expect(page.locator('.element-header').first())
        .toHaveText('Financial Overview')
        });

test('round2', async ({ page }) => {
    await page.goto('https://kitchen.applitools.com/ingredients/iframe')

    await expect(
        page.frameLocator('#the-kitchen-table')
            .locator('#fruits-vegetables')
        )
        .toBeVisible()
    });

test('round3', async ({ page }) => {
    await page.goto('https://automationbookstore.dev')

    await page.locator('#searchBar').fill('testing')
    await expect(page.locator('li:visible')).toHaveCount(1)

    });

test('round4', async ({ page }) => {
    // Accept alert
    page.once('dialog', dialog => {
        expect(dialog.message()).toBe('Airfryers can make anything!')
        dialog.accept()
    })
    await page.goto('https://kitchen.applitools.com/ingredients/alert')
    await page.locator('#alert-button').click()

    // Dismiss alert
    page.once('dialog', dialog => dialog.dismiss())
    await page.goto('https://kitchen.applitools.com/ingredients/alert')
    await page.locator('#confirm-button').click()

    // Answer prompt
    page.once('dialog', dialog => dialog.accept('nachos'))
    await page.goto('https://kitchen.applitools.com/ingredients/alert')
    await page.locator('#prompt-button').click()
    });

test('round5', async ({ context, page }) => {
    await page.goto('https://kitchen.applitools.com/ingredients/links')
    await page.locator('#button-the-kitchen-table').click()

    const newPage = await context.waitForEvent('page')
    await expect(newPage.url()).toContain('/ingredients/table')
    await expect(newPage.locator('#fruits-vegetables')).toBeVisible()

    });


test('round6', async ({ request }) => {
    const response = await request.get('https://kitchen.applitools.com/api/recipes')
    await expect(response).toBeOK()

    const body = await response.json()
    expect(body.time).toBeGreaterThan(0)
    expect(body.data.length).toBeGreaterThan(0)
    });

test('round7', async ({ page }) => {

    class LoginPage {
        page: Page
        usernameInput: Locator
        passwordInput: Locator
        loginButton: Locator

        constructor(page: Page) {
            this.page = page
            this.usernameInput = page.locator('#username')
            this.passwordInput = page.locator('#password')
            this.loginButton = page.locator('#log-in')
        }

        async load() {
            await this.page.goto('https://demo.applitools.com/')
        }

        async login(username: string, password: string) {
            await this.usernameInput.fill(username)
            await this.passwordInput.fill(password)
            await this.loginButton.click()
        }
    }

    const loginPage = new LoginPage(page)
    await loginPage.load()
    await loginPage.login('andy', 'panda<3')
    });