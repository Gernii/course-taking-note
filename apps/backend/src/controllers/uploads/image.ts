import { mkdir } from 'fs/promises';

import { OpenAPIHono } from '@hono/zod-openapi';
import { StatusCodes } from 'http-status-codes';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { env } from 'hono/adapter';

import { routeUploadImage } from '$routes/uploads/image';

import { customHTTPException } from '$utils/create-custom-error-message';

type Bindings = {
	IMAGE_RESIZE_GIF_MAX_SIZE?: number;
	IMAGE_RESIZE_MAX_SIZE?: number;
};

export const controllerUploadsImage = new OpenAPIHono<{ Bindings: Bindings }>();

controllerUploadsImage.openapi(routeUploadImage, async (c) => {
	const form = await c.req.formData();

	const image = form.get(IMAGE_FORMDATA_NAME);

	const isImageFile = isFile(image);

	if (!isImageFile) {
		throw customHTTPException(StatusCodes.UNSUPPORTED_MEDIA_TYPE, {
			message: 'Invalid file type'
		});
	}

	const isImageTypeAllowed = ALLOW_IMAGE_TYPES.includes(image.type as AllowImageTypeTypes);

	if (!isImageTypeAllowed) {
		throw customHTTPException(StatusCodes.UNSUPPORTED_MEDIA_TYPE, {
			message: 'Invalid file type'
		});
	}

	// Create the directory if it doesn't exist
	await mkdir(ASSETS_DES, { recursive: true });

	const imageFileNameDetails = getImageFileNameDetails(image.name);

	if (!imageFileNameDetails) {
		throw customHTTPException(StatusCodes.BAD_REQUEST, {
			message: 'Invalid file name'
		});
	}

	const imageSaveName = getImageSaveName(
		imageFileNameDetails.origin,
		imageFileNameDetails.extension
	);

	const imgBuffer = await getImageBuffer(image);

	const imageMeta = await sharp(imgBuffer).metadata();

	if (!imageMeta.size || !imageMeta.width || !imageMeta.height) {
		throw customHTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'Failed to get image metadata'
		});
	}

	const { IMAGE_RESIZE_GIF_MAX_SIZE, IMAGE_RESIZE_MAX_SIZE } = env(c);

	const imageResizeScaleFactor = getImageResizeScaleFactor({
		extension: imageFileNameDetails.extension,
		size: imageMeta.size,
		envMaxSize: IMAGE_RESIZE_MAX_SIZE,
		envMaxGIFSize: IMAGE_RESIZE_GIF_MAX_SIZE
	});

	await sharp(imgBuffer)
		.resize({
			width: Math.round(imageMeta.width * imageResizeScaleFactor),
			height: Math.round(imageMeta.height * imageResizeScaleFactor),
			fit: 'inside',
			withoutEnlargement: true
		})
		.toFormat(imageFileNameDetails.extension)
		.toFile(`${ASSETS_DES}/${imageSaveName}`);

	return c.json({ image_url: `${new URL(c.req.url).origin}/statics/${imageSaveName}` });
});

const isFile = (value: unknown): value is File => {
	if (typeof value !== 'object' || value === null) return false;
	return value instanceof Blob && value.constructor.name === 'File';
};

const getImageBuffer = async (image: File) => {
	const arrayBuffer = await image.arrayBuffer();
	return Buffer.from(arrayBuffer);
};

const getImageFileNameDetails = (fileName: string) => {
	const name = fileName;
	const lastDot = name.lastIndexOf('.');

	if (lastDot === -1) {
		return undefined;
	}

	return {
		origin: name.substring(0, lastDot),
		extension: name.substring(lastDot + 1) as AllowImageExtensionTypes
	};
};

const getImageSaveName = (origin: string, extension: AllowImageExtensionTypes) =>
	`${origin}-${nanoid()}.${extension}`;

interface GetImageResizeScaleFactorProps {
	extension: AllowImageExtensionTypes;
	size: number;
	envMaxSize?: number;
	envMaxGIFSize?: number;
}
const getImageResizeScaleFactor = (props: GetImageResizeScaleFactorProps) => {
	const { extension, size, envMaxSize, envMaxGIFSize } = props;

	const maxSize =
		extension === 'gif'
			? envMaxGIFSize ?? DEFAULT_IMAGE_RESIZE_GIF_MAX_SIZE
			: envMaxSize ?? DEFAULT_IMAGE_RESIZE_MAX_SIZE;

	return Math.min(1, Math.sqrt(maxSize / size));
};

// Constants

type AllowImageExtensionTypes = 'jpeg' | 'jpg' | 'png' | 'gif' | 'webp';

const ALLOW_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/gif',
	'image/webp'
] as const;

type AllowImageTypeTypes = (typeof ALLOW_IMAGE_TYPES)[number];

// Max size in bytes: 2MB for GIF, 1MB for other types
const DEFAULT_IMAGE_RESIZE_GIF_MAX_SIZE = 2.097e6 as const;
const DEFAULT_IMAGE_RESIZE_MAX_SIZE = 1.048576e6 as const;

const IMAGE_FORMDATA_NAME = 'image';
const ASSETS_DES = './statics';
