import { NextFunction, Request, Response } from 'express';
import HttpError from '../lib/http-error';
import { URL_REGEX } from '../lib/constants';
import URL from '../models/url';

/**
 * @desc  Shortens a provided URL
 * @route  POST /
 * @access  Public
 */
export const shortenURL = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { url } = request.body;

    if (!url) {
      throw new HttpError('No URL was provided.', 400);
    }

    if (!URL_REGEX.test(url)) {
      throw new HttpError('Invalid URL.', 400);
    }

    const previous_url_record = await URL.findOne({
      destination_url: url,
    });

    if (previous_url_record) {
      response.json({
        short_url: `${process.env.API_BASE_URL}/${previous_url_record.url_id}`,
      });

      return;
    }

    // use dynamic import as nanoid doesn't support compiled commonjs module
    const { customAlphabet } = await import('nanoid');

    const nanoid = customAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      5
    );

    const url_id = nanoid();

    await URL.create({
      url_id,
      destination_url: url,
    });

    response
      .status(201)
      .json({ short_url: `${process.env.API_BASE_URL}/${url_id}` });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @desc  Handles redirecting to destination URL if ID in URL param is valid is valid
 * @route  GET /:id
 * @access  Public
 */
export const routeToURL = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params;

    const url_record = await URL.findOne({ url_id: id });

    if (!url_record) {
      throw new HttpError('No URL record found.', 404);
    }

    response.redirect(url_record.destination_url);
  } catch (error: any) {
    next(error);
  }
};
