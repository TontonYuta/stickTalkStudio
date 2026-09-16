import React from 'react';
import { Character, CharacterPose, Keyframe, PropItem } from '../types';

export const interpolateValue = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};

// Easing function for organic acceleration & deceleration
export const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/**
 * Calculates snappy, purposeful gesture transition progress.
 * Prevents "drifting unconsciously" (trôi vô thức) between far-apart keyframes.
 * When keyframes are separated by seconds (e.g. 2s - 5s), the character firmly holds
 * the previous pose, then decisively transitions into the new pose over a snappy
 * action window (~0.4s - 0.65s) right on cue!
 */
export const calculatePoseTransitionProgress = (
  currentTime: number,
  startTime: number,
  endTime: number
): number => {
  const gap = endTime - startTime;
  if (gap <= 0) return 1;

  // If keyframes are close (<= 0.85s), transition spans the whole interval smoothly
  if (gap <= 0.85) {
    const raw = Math.max(0, Math.min(1, (currentTime - startTime) / gap));
    return easeInOutCubic(raw);
  }

  // If keyframes are far apart (> 0.85s), transition happens in a decisive action window
  // leading right into the target cue time (endTime)
  const transitionDuration = Math.min(0.65, Math.max(0.40, gap * 0.25));
  const transitionStart = endTime - transitionDuration;

  if (currentTime <= transitionStart) {
    return 0; // Hold previous pose firmly with zero drifting!
  }
  if (currentTime >= endTime) {
    return 1; // Arrived at target pose!
  }

  const raw = (currentTime - transitionStart) / transitionDuration;
  return easeInOutCubic(raw);
};

export const getInterpolatedCharacter = (character: Character, currentTime: number): Character => {
  if (!character.keyframes || character.keyframes.length === 0) {
    return character;
  }

  const sortedKeyframes = [...character.keyframes].sort((a, b) => a.time - b.time);
  let prevFrame: Keyframe | null = null;
  let nextFrame: Keyframe | null = null;

  for (const kf of sortedKeyframes) {
    if (kf.time <= currentTime) {
      prevFrame = kf;
    } else if (kf.time > currentTime && !nextFrame) {
      nextFrame = kf;
    }
  }

  if (!prevFrame && nextFrame) {
    return applyKeyframe(character, nextFrame);
  }

  if (prevFrame && !nextFrame) {
    return applyKeyframe(character, prevFrame);
  }

  if (prevFrame && nextFrame) {
    const progress = calculatePoseTransitionProgress(currentTime, prevFrame.time, nextFrame.time);

    // Initial interpolated coordinates & angles
    const prevX = prevFrame.x ?? character.x;
    const nextX = nextFrame.x ?? character.x;
    const dx = nextX - prevX;
    let interpX = interpolateValue(prevX, nextX, progress);
    let interpY = interpolateValue(prevFrame.y ?? character.y, nextFrame.y ?? character.y, progress);
    let interpScale = interpolateValue(prevFrame.scale ?? character.scale, nextFrame.scale ?? character.scale, progress);
    let interpRotation = interpolateValue(prevFrame.rotation ?? character.rotation ?? 0, nextFrame.rotation ?? character.rotation ?? 0, progress);
    let interpFlipX = progress >= 0.5 ? (nextFrame.flipX ?? character.flipX) : (prevFrame.flipX ?? character.flipX);

    let interpArmL = interpolateValue(prevFrame.pose?.armL ?? character.pose.armL, nextFrame.pose?.armL ?? character.pose.armL, progress);
    let interpArmR = interpolateValue(prevFrame.pose?.armR ?? character.pose.armR, nextFrame.pose?.armR ?? character.pose.armR, progress);
    let interpLegL = interpolateValue(prevFrame.pose?.legL ?? character.pose.legL, nextFrame.pose?.legL ?? character.pose.legL, progress);
    let interpLegR = interpolateValue(prevFrame.pose?.legR ?? character.pose.legR, nextFrame.pose?.legR ?? character.pose.legR, progress);
    let interpBodyLean = interpolateValue(prevFrame.pose?.bodyLean ?? character.pose.bodyLean ?? 0, nextFrame.pose?.bodyLean ?? character.pose.bodyLean ?? 0, progress);
    let interpHeadTilt = interpolateValue(prevFrame.pose?.headTilt ?? character.pose.headTilt ?? 0, nextFrame.pose?.headTilt ?? character.pose.headTilt ?? 0, progress);

    // Only apply gentle stepping if explicitly relocating across stage (dx >= 8%)
    // For normal dialogue, characters stay stably and firmly grounded without unnecessary pacing
    if (Math.abs(dx) >= 8.0 && progress > 0.05 && progress < 0.95) {
      const stepCycles = Math.max(1, Math.round(Math.abs(dx) / 5));
      const walkPhase = progress * Math.PI * 2 * stepCycles;
      const stepSwing = Math.sin(walkPhase) * 16;
      const stepBounce = -Math.abs(Math.sin(walkPhase)) * 1.8;

      interpLegL += stepSwing;
      interpLegR -= stepSwing;
      interpY += stepBounce;
      interpArmL -= stepSwing * 0.35;
      interpArmR += stepSwing * 0.35;
    }

    return {
      ...character,
      x: interpX,
      y: interpY,
      scale: interpScale,
      rotation: interpRotation,
      flipX: interpFlipX,
      pose: {
        armL: interpArmL,
        armR: interpArmR,
        legL: interpLegL,
        legR: interpLegR,
        bodyLean: interpBodyLean,
        headTilt: interpHeadTilt,
      }
    };
  }

  return character;
};

const applyKeyframe = (character: Character, keyframe: Keyframe): Character => {
  return {
    ...character,
    x: keyframe.x ?? character.x,
    y: keyframe.y ?? character.y,
    scale: keyframe.scale ?? character.scale,
    rotation: keyframe.rotation ?? character.rotation ?? 0,
    flipX: keyframe.flipX ?? character.flipX,
    pose: {
      armL: keyframe.pose?.armL ?? character.pose.armL,
      armR: keyframe.pose?.armR ?? character.pose.armR,
      legL: keyframe.pose?.legL ?? character.pose.legL,
      legR: keyframe.pose?.legR ?? character.pose.legR,
      bodyLean: keyframe.pose?.bodyLean ?? character.pose.bodyLean ?? 0,
      headTilt: keyframe.pose?.headTilt ?? character.pose.headTilt ?? 0,
    },
  };
};

export const getInterpolatedProp = (prop: PropItem, currentTime: number): PropItem => {
  if (!prop.keyframes || prop.keyframes.length === 0) {
    return prop;
  }

  const sortedKeyframes = [...prop.keyframes].sort((a, b) => a.time - b.time);
  let prevFrame: Keyframe | null = null;
  let nextFrame: Keyframe | null = null;

  for (const kf of sortedKeyframes) {
    if (kf.time <= currentTime) {
      prevFrame = kf;
    } else if (kf.time > currentTime && !nextFrame) {
      nextFrame = kf;
    }
  }

  if (!prevFrame && nextFrame) {
    return applyPropKeyframe(prop, nextFrame);
  }

  if (prevFrame && !nextFrame) {
    return applyPropKeyframe(prop, prevFrame);
  }

  if (prevFrame && nextFrame) {
    const progress = calculatePoseTransitionProgress(currentTime, prevFrame.time, nextFrame.time);

    return {
      ...prop,
      x: interpolateValue(prevFrame.x ?? prop.x, nextFrame.x ?? prop.x, progress),
      y: interpolateValue(prevFrame.y ?? prop.y, nextFrame.y ?? prop.y, progress),
      scale: interpolateValue(prevFrame.scale ?? prop.scale, nextFrame.scale ?? prop.scale, progress),
      rotation: interpolateValue(prevFrame.rotation ?? prop.rotation, nextFrame.rotation ?? prop.rotation, progress),
    };
  }

  return prop;
};

const applyPropKeyframe = (prop: import('../types').PropItem, keyframe: import('../types').Keyframe): import('../types').PropItem => {
  return {
    ...prop,
    x: keyframe.x ?? prop.x,
    y: keyframe.y ?? prop.y,
    scale: keyframe.scale ?? prop.scale,
    rotation: keyframe.rotation ?? prop.rotation,
  };
};

export const getAnimationStyles = (
  element: { startTime: number, duration: number, animation?: import('../types').AnimationSettings }, 
  currentTime: number
): React.CSSProperties => {
  const styles: React.CSSProperties = { opacity: 1, transform: 'translate(-50%, -50%)' };
  
  if (!element.animation) return styles;

  const inDuration = element.animation.inDuration || 0.5;
  const outDuration = element.animation.outDuration || 0.5;
  
  const timeFromStart = currentTime - element.startTime;
  const timeFromEnd = (element.startTime + element.duration) - currentTime;

  // In Animation
  if (element.animation.in && timeFromStart < inDuration && timeFromStart >= 0) {
    const progress = timeFromStart / inDuration;
    switch (element.animation.in) {
      case 'fadeIn':
        styles.opacity = progress;
        break;
      case 'slideInLeft':
        styles.transform = `translate(-150%, -50%)`;
        if (progress > 0) styles.transform = `translate(calc(-50% - ${(1 - progress) * 100}px), -50%)`;
        styles.opacity = progress;
        break;
      case 'slideInRight':
        styles.transform = `translate(150%, -50%)`;
        if (progress > 0) styles.transform = `translate(calc(-50% + ${(1 - progress) * 100}px), -50%)`;
        styles.opacity = progress;
        break;
      case 'slideInTop':
        if (progress > 0) styles.transform = `translate(-50%, calc(-50% - ${(1 - progress) * 100}px))`;
        styles.opacity = progress;
        break;
      case 'slideInBottom':
        if (progress > 0) styles.transform = `translate(-50%, calc(-50% + ${(1 - progress) * 100}px))`;
        styles.opacity = progress;
        break;
      case 'zoomIn':
        styles.transform = `translate(-50%, -50%) scale(${progress})`;
        styles.opacity = progress;
        break;
      case 'bounceIn':
        const bounce = Math.sin(progress * Math.PI * 2) * 0.2 + progress;
        styles.transform = `translate(-50%, -50%) scale(${Math.min(bounce, 1)})`;
        styles.opacity = progress;
        break;
    }
  }

  // Out Animation
  if (element.animation.out && timeFromEnd < outDuration && timeFromEnd >= 0) {
    const progress = 1 - (timeFromEnd / outDuration); // 0 to 1 as it animates out
    switch (element.animation.out) {
      case 'fadeOut':
        styles.opacity = 1 - progress;
        break;
      case 'slideOutLeft':
        styles.transform = `translate(calc(-50% - ${progress * 100}px), -50%)`;
        styles.opacity = 1 - progress;
        break;
      case 'slideOutRight':
        styles.transform = `translate(calc(-50% + ${progress * 100}px), -50%)`;
        styles.opacity = 1 - progress;
        break;
      case 'slideOutTop':
        styles.transform = `translate(-50%, calc(-50% - ${progress * 100}px))`;
        styles.opacity = 1 - progress;
        break;
      case 'slideOutBottom':
        styles.transform = `translate(-50%, calc(-50% + ${progress * 100}px))`;
        styles.opacity = 1 - progress;
        break;
      case 'zoomOut':
        styles.transform = `translate(-50%, -50%) scale(${1 - progress})`;
        styles.opacity = 1 - progress;
        break;
      case 'bounceOut':
        styles.transform = `translate(-50%, -50%) scale(${1 - progress})`;
        styles.opacity = 1 - progress;
        break;
    }
  }

  return styles;
};
