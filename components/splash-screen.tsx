import { useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LETTERS = ['A', 'T', 'L', 'A', 'S'];

const SLIDE_DURATION = 600;
const LETTER_STAGGER = 150;
const LETTER_DURATION = 300;
const PAUSE_AFTER_LETTERS = 500;
const POP_DURATION = 400;
const FADE_OUT_DURATION = 500;

const ARC_RADIUS = 190; //distance from center of earth
const ARC_SPAN_DEGREES = 130; //span of letters spaced on top

const LETTER_Y_OFFSETS = [0, 0, 0, 0, 10];

const letterArcTransforms = LETTERS.map((_, index) => {
  const angleDeg =
    -ARC_SPAN_DEGREES / 2 + index * (ARC_SPAN_DEGREES / (LETTERS.length - 1));
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    translateX: ARC_RADIUS * Math.sin(angleRad),
    translateY: -ARC_RADIUS * Math.cos(angleRad) + LETTER_Y_OFFSETS[index],
    rotateDeg: angleDeg,
  };
});

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const translateY = useSharedValue(-SCREEN_HEIGHT);
  const containerOpacity = useSharedValue(1);
  const earthRotation = useSharedValue(0);
  const groupScale = useSharedValue(1);

  const letterOpacity0 = useSharedValue(0);
  const letterOpacity1 = useSharedValue(0);
  const letterOpacity2 = useSharedValue(0);
  const letterOpacity3 = useSharedValue(0);
  const letterOpacity4 = useSharedValue(0);
  const letterOpacities = [letterOpacity0, letterOpacity1, letterOpacity2, letterOpacity3, letterOpacity4];

  const letterScale0 = useSharedValue(0.4);
  const letterScale1 = useSharedValue(0.4);
  const letterScale2 = useSharedValue(0.4);
  const letterScale3 = useSharedValue(0.4);
  const letterScale4 = useSharedValue(0.4);
  const letterScales = [letterScale0, letterScale1, letterScale2, letterScale3, letterScale4];

  const handleFinish = useCallback(() => {
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: SLIDE_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    earthRotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );

    LETTERS.forEach((_, index) => {
      const delay = SLIDE_DURATION + index * LETTER_STAGGER;
      letterOpacities[index].value = withDelay(delay, withTiming(1, { duration: LETTER_DURATION }));
      letterScales[index].value = withDelay(
        delay,
        withSequence(
          withTiming(1.2, { duration: LETTER_DURATION * 0.6 }),
          withTiming(1, { duration: LETTER_DURATION * 0.4 }),
        ),
      );
    });

    const popDelay =
      SLIDE_DURATION + LETTERS.length * LETTER_STAGGER + LETTER_DURATION + PAUSE_AFTER_LETTERS;

    groupScale.value = withDelay(
      popDelay,
      withSequence(
        withTiming(1.3, { duration: POP_DURATION * 0.5 }),
        withTiming(1, { duration: POP_DURATION * 0.5 }),
      ),
    );

    containerOpacity.value = withDelay(
      popDelay + POP_DURATION,
      withTiming(0, { duration: FADE_OUT_DURATION }, (finished) => {
        if (finished) {
          scheduleOnRN(handleFinish);
        }
      }),
    );
    // Mount-only: this is a one-shot intro sequence, never re-triggered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: containerOpacity.value,
  }));

  const earthStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${earthRotation.value}deg` }],
  }));

  const groupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: groupScale.value }],
  }));

  const letterStyle0 = useAnimatedStyle(() => ({
    opacity: letterOpacity0.value,
    transform: [
      { translateX: letterArcTransforms[0].translateX },
      { translateY: letterArcTransforms[0].translateY },
      { rotate: `${letterArcTransforms[0].rotateDeg}deg` },
      { scale: letterScale0.value },
    ],
  }));
  const letterStyle1 = useAnimatedStyle(() => ({
    opacity: letterOpacity1.value,
    transform: [
      { translateX: letterArcTransforms[1].translateX },
      { translateY: letterArcTransforms[1].translateY },
      { rotate: `${letterArcTransforms[1].rotateDeg}deg` },
      { scale: letterScale1.value },
    ],
  }));
  const letterStyle2 = useAnimatedStyle(() => ({
    opacity: letterOpacity2.value,
    transform: [
      { translateX: letterArcTransforms[2].translateX },
      { translateY: letterArcTransforms[2].translateY },
      { rotate: `${letterArcTransforms[2].rotateDeg}deg` },
      { scale: letterScale2.value },
    ],
  }));
  const letterStyle3 = useAnimatedStyle(() => ({
    opacity: letterOpacity3.value,
    transform: [
      { translateX: letterArcTransforms[3].translateX },
      { translateY: letterArcTransforms[3].translateY },
      { rotate: `${letterArcTransforms[3].rotateDeg}deg` },
      { scale: letterScale3.value },
    ],
  }));
  const letterStyle4 = useAnimatedStyle(() => ({
    opacity: letterOpacity4.value,
    transform: [
      { translateX: letterArcTransforms[4].translateX },
      { translateY: letterArcTransforms[4].translateY },
      { rotate: `${letterArcTransforms[4].rotateDeg}deg` },
      { scale: letterScale4.value },
    ],
  }));
  const letterStyles = [letterStyle0, letterStyle1, letterStyle2, letterStyle3, letterStyle4];

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.earth, earthStyle]}>🌍</Animated.Text>
      <Animated.View style={[styles.lettersRow, groupStyle]}>
        {LETTERS.map((letter, index) => (
          <Animated.Text key={`${letter}-${index}`} style={[styles.letter, letterStyles[index]]}>
            {letter}
          </Animated.Text>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E5FD9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  earth: {
    fontSize: 300,
  },
  lettersRow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    position: 'absolute',
    width: 44,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
