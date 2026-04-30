import { Page, Locator } from '@playwright/test';

export class AiGeneratorPage {
  readonly page: Page;

  readonly apiKeyInput: Locator;
  readonly objectiveInput: Locator;
  readonly generateButton: Locator;
  readonly aiGenerator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.apiKeyInput = page.getByTestId('ai-api-key-input');
    this.objectiveInput = page.getByTestId('ai-objective-input');
    this.generateButton = page.getByTestId('ai-generate-button');
    this.aiGenerator = page.getByTestId('ai-generator');
  }

  async setApiKey(apiKey: string) {
    await this.apiKeyInput.fill(apiKey);
  }

  async clearApiKey() {
    await this.apiKeyInput.clear();
  }

  async generate(objective: string) {
    await this.objectiveInput.fill(objective);
    await this.generateButton.click();
  }

  async generateWithKey(apiKey: string, objective: string) {
    await this.setApiKey(apiKey);
    await this.generate(objective);
  }

  async waitForGeneration() {
    await this.page.waitForResponse(
      (res) => res.url().includes('/ai/generate') && res.request().method() === 'POST',
      { timeout: 30000 }
    );
  }

  async isLoading(): Promise<boolean> {
    const text = await this.generateButton.textContent();
    return text?.includes('Carregando') ?? false;
  }
}
