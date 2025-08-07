import React, { useEffect, useRef, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../../../reducers';
import { id } from 'ethers/lib/utils';

const lockTime = useSelector((state: RootState) => state.settings.lockTime);

const idleLock = useSelector(
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (state: RootState) => state.settings.idleLock,
);

let AUTO_LOCK_TIMEOUT = 0; // 0秒立即锁定，可改为你想要的秒数

if (idleLock) {
  AUTO_LOCK_TIMEOUT = 5 * 1000;
} else {
  AUTO_LOCK_TIMEOUT = lockTime;
}
interface AppLockWrapperProps {
  children: ReactNode;
}
const AppLockWrapper: React.FC<AppLockWrapperProps> = ({ children }) => {
  const navigation = useNavigation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 重置定时器
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // 跳转到锁屏页
      navigation.navigate('Home');
    }, AUTO_LOCK_TIMEOUT);
  };

  // 监听 AppState（如切后台立即锁定）
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState !== 'active') {
        navigation.navigate('Home');
      }
    };
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [navigation]);

  // 监听用户操作
  useEffect(() => {
    resetTimer();
    const touchListener = () => resetTimer();
    // 你可以用全局事件或在根组件包裹 TouchableWithoutFeedback
    // 这里只是示例
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={resetTimer}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default AppLockWrapper;