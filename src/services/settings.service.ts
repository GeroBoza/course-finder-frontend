import type { ChatgptImportPromptResponse } from '@/types';
import fetchApi from './api';

export const settingsService = {
    async getChatgptImportPrompt(): Promise<ChatgptImportPromptResponse> {
        const response = await fetchApi<ChatgptImportPromptResponse>(
            '/settings/chatgpt-import-prompt',
        );
        return response.data;
    },

    async updateChatgptImportPrompt(
        prompt: string,
    ): Promise<ChatgptImportPromptResponse> {
        const response = await fetchApi<ChatgptImportPromptResponse>(
            '/settings/chatgpt-import-prompt',
            {
                method: 'PUT',
                body: JSON.stringify({ prompt }),
            },
        );
        return response.data;
    },

    async resetChatgptImportPrompt(): Promise<ChatgptImportPromptResponse> {
        const response = await fetchApi<ChatgptImportPromptResponse>(
            '/settings/chatgpt-import-prompt',
            { method: 'DELETE' },
        );
        return response.data;
    },
};
