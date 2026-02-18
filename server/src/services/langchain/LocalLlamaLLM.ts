import { LLM, BaseLLMParams } from '@langchain/core/language_models/llms';
import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import axios from 'axios';
import { llmLogger } from '@utils/logger.js';

export interface LocalLlamaLLMParams extends BaseLLMParams {
  url: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export class LocalLlamaLLM extends LLM {
  url: string;
  maxTokens: number;
  temperature: number;
  timeout: number;

  constructor(params: LocalLlamaLLMParams) {
    super(params);
    this.url = params.url;
    this.maxTokens = params.maxTokens ?? 200;
    this.temperature = params.temperature ?? 0.1;
    this.timeout = params.timeout ?? 30000;
  }

  _llmType(): string {
    return 'local-llama';
  }

  async _call(
    prompt: string,
    _options?: this['ParsedCallOptions'],
    _runManager?: CallbackManagerForLLMRun
  ): Promise<string> {
    const startTime = Date.now();
    
    try {
      llmLogger.logPrompt(prompt, 'local-llama');

      const response = await axios.post(
        `${this.url}/generate`,
        {
          prompt,
          max_length: this.maxTokens,
          temperature: this.temperature,
        },
        { timeout: this.timeout }
      );

      const duration = Date.now() - startTime;
      llmLogger.logResponse(response.data.text || '', duration);

      return response.data.text || '';
    } catch (error) {
      llmLogger.logError(error as Error, 'LLM call failed');
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('LLM request timeout');
        }
        throw new Error(`LLM service error: ${error.message}`);
      }
      throw error;
    }
  }
}