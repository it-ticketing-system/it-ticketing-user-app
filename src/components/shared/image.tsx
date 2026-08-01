import Image, { getImageProps, type ImageProps } from 'next/image';

type StaticImageSource = Exclude<ImageProps['src'], string>;

type SourceOptions = {
  sizes?: ImageProps['sizes'];
};

type StringDImageSource = SourceOptions & {
  src: string;
  width: NonNullable<ImageProps['width']>;
  height: NonNullable<ImageProps['height']>;
};

type StaticDImageSource = SourceOptions & {
  src: StaticImageSource;
  width?: ImageProps['width'];
  height?: ImageProps['height'];
};

type DImageSource = StringDImageSource | StaticDImageSource;

type DImageVariant = DImageSource & {
  media: string;
};

type NormalStringImageProps = Omit<
  ImageProps,
  'src' | 'width' | 'height' | 'fill'
> & {
  src: string;
  width: NonNullable<ImageProps['width']>;
  height: NonNullable<ImageProps['height']>;
  fill?: false;
  sources?: never;
  pictureClassName?: never;
};

type NormalFillImageProps = Omit<
  ImageProps,
  'src' | 'width' | 'height' | 'fill'
> & {
  src: string;
  fill: true;
  width?: never;
  height?: never;
  sources?: never;
  pictureClassName?: never;
};

type NormalStaticImageProps = Omit<ImageProps, 'src'> & {
  src: StaticImageSource;
  sources?: never;
  pictureClassName?: never;
};

type NormalDImageProps =
  NormalStringImageProps | NormalFillImageProps | NormalStaticImageProps;

type ResponsiveDImageProps = Omit<
  ImageProps,
  | 'src'
  | 'width'
  | 'height'
  | 'fill'
  | 'placeholder'
  | 'blurDataURL'
  | 'preload'
  | 'priority'
> & {
  src?: never;
  width?: never;
  height?: never;
  fill?: never;

  sources: {
    default: DImageSource;
    variants?: readonly DImageVariant[];
  };

  pictureClassName?: string;
};

type DImageProps = NormalDImageProps | ResponsiveDImageProps;

const isResponsiveImage = (
  props: DImageProps,
): props is ResponsiveDImageProps => {
  return 'sources' in props && props.sources !== undefined;
};

const DImage = (props: DImageProps) => {
  if (!isResponsiveImage(props)) {
    const { alt, ...imageProps } = props;

    return <Image {...imageProps} alt={alt} />;
  }

  const { sources, pictureClassName, alt, ...sharedProps } = props;

  const createImageProps = (source: DImageSource): ImageProps => {
    return {
      ...sharedProps,
      ...source,
      src: source.src,
      alt,
      sizes: source.sizes ?? sharedProps.sizes,
    } as ImageProps;
  };

  const { props: generatedDefaultProps } = getImageProps(
    createImageProps(sources.default),
  );

  return (
    <picture className={pictureClassName}>
      {sources.variants?.map((source) => {
        const { props: sourceProps } = getImageProps(createImageProps(source));

        return (
          <source
            key={`${source.media}-${String(source.src)}`}
            media={source.media}
            srcSet={sourceProps.srcSet}
            sizes={sourceProps.sizes}
            width={sourceProps.width}
            height={sourceProps.height}
          />
        );
      })}

      <img {...generatedDefaultProps} alt={alt} />
    </picture>
  );
};

export default DImage;
