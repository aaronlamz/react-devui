import React, { useEffect, useRef, useState } from 'react';

import { getClassName } from '@react-devui/utils';

import { registerComponentMate } from '../../utils';
import { useComponentConfig, usePrefixConfig } from '../root';

export interface DAvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  dVariant?: 'circular' | 'square';
  dImg?: React.ImgHTMLAttributes<HTMLImageElement>;
  dIcon?: React.ReactNode;
  dText?: React.ReactNode;
  dSize?: number;
}

const { COMPONENT_NAME } = registerComponentMate({ COMPONENT_NAME: 'DAvatar' as const });
export function DAvatar(props: DAvatarProps): JSX.Element | null {
  const {
    dVariant = 'circular',
    dImg,
    dIcon,
    dText,
    dSize = 40,

    ...restProps
  } = useComponentConfig(COMPONENT_NAME, props);

  //#region Context
  const dPrefix = usePrefixConfig();
  //#endregion

  //#region Ref
  const textRef = useRef<HTMLDivElement>(null);
  //#endregion

  const [imgError, setImgError] = useState(false);
  const type: 'img' | 'icon' | 'text' = dImg && !imgError ? 'img' : dIcon ? 'icon' : dText ? 'text' : 'img';

  useEffect(() => {
    if (textRef.current) {
      const maxWidth = Math.sqrt(Math.pow(dSize / 2, 2) - Math.pow(textRef.current.scrollHeight / 2, 2)) * 2;
      if (textRef.current.scrollWidth > maxWidth) {
        textRef.current.style.transform = `scale(${maxWidth / textRef.current.scrollWidth})`;
      } else {
        textRef.current.style.transform = '';
      }
    }
  });

  return (
    <div
      {...restProps}
      className={getClassName(restProps.className, `${dPrefix}avatar`, `${dPrefix}avatar--${type}`, `${dPrefix}avatar--${dVariant}`)}
      style={{
        ...restProps.style,
        width: dSize,
        height: dSize,
        fontSize: type === 'icon' ? dSize / 2 : type === 'text' ? dSize * 0.45 : undefined,
      }}
    >
      {type === 'img' ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          {...dImg}
          className={getClassName(dImg?.className, `${dPrefix}avatar__img`)}
          onError={(e) => {
            dImg?.onError?.(e);

            setImgError(true);
          }}
        />
      ) : type === 'icon' ? (
        dIcon
      ) : (
        <div ref={textRef}>{dText}</div>
      )}
    </div>
  );
}
