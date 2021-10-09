import { INTERNAL_ERROR_MESSAGE } from '@src/errors/internalError';
import { TokenPayload } from '@src/services/auth';
import {
    Response as ExpressResponse,
    Request as ExpressRequest,
} from 'express';

export type httpResponse = {
    response: ExpressResponse;
    status: number;
    error?: string;
    data?: any;
};

export function httpResponse({
    response,
    status,
    data,
    error,
}: httpResponse): ExpressResponse {
    const responseData = data ? { ...data } : {};

    return response.status(status).json({
        error: error,
        ...responseData,
    });
}

export function httpInternalErrorResponse(
    response: ExpressResponse
): ExpressResponse {
    return response.status(500).json({ error: INTERNAL_ERROR_MESSAGE });
}

export interface Request<T = any> extends ExpressRequest {
    body: T;
    user_decoded?: TokenPayload;
}

export type Response<T = any> = {
    status: number;
    data?: T;
    error?: string;
};