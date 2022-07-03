import {RefObject, useEffect} from 'react';
import { calculateLayout } from '../utils/helpers';

export const useCalculateVideoLayout = (galleryRef: RefObject<HTMLDivElement>, videoCount: number) => {
  useEffect(() => {
    const recalculateLayout = () => {
      const headerHeight = document.getElementsByTagName('header')?.[0]?.offsetHeight;
      const aspectRatio = 16 / 9;

      const screenWidth = document.body.getBoundingClientRect().width;
      const screenHeight = document.body.getBoundingClientRect().height - headerHeight;

      const { width, height, cols } = calculateLayout(screenWidth, screenHeight, videoCount, aspectRatio);

      galleryRef.current?.style?.setProperty('--width', width + 'px');
      galleryRef.current?.style?.setProperty('--height', height + 'px');
      galleryRef.current?.style?.setProperty('--cols', cols + '');
    };

    recalculateLayout();

    window.addEventListener('resize', recalculateLayout);

    return () => {
      window.removeEventListener('resize', recalculateLayout);
    };
  }, [galleryRef, videoCount]);
};
