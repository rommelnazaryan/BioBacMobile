import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '@/theme/Colors';
import Header from '@/navigation/Header';
import {Switch} from 'react-native-switch';
import useSetting from '@/hooks/useSetting.tsx';
import { FontFamily, FontSizes } from '@/theme';
import {t} from '@/locales';
import { resetToSignIn } from '@/navigation/rootNavigation';
import useAuthStore from '@/zustland/authStore';
export default function Settings() {
  const {isEnabled, toggleSwitch} = useSetting();
  const {clear} = useAuthStore();
  const logout = () => {
    clear();
    resetToSignIn();
  };
  return (
    <View style={styles.container}>
      <Header title={t('settings.title')} showBack={true} />
      <View style={styles.switchContainer}>
        <Text style={styles.title}>{t('settings.language')}</Text>
        <Switch
          value={isEnabled}
          onValueChange={val => toggleSwitch(val)}
          activeText={'RU'}
          inActiveText={'EN'}
          circleSize={16}
          barHeight={23}
          circleBorderWidth={0}
          backgroundActive={Colors.blue}
          backgroundInactive={Colors.blue}
          circleActiveColor={Colors.white}
          circleInActiveColor={Colors.white}
          switchLeftPx={5}
          switchRightPx={5}
          switchWidthMultiplier={3.2}
        />

      </View>
      <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => logout()}
        >
          <Text style={styles.logoutButtonText}>{t('common.logout')}</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    color: Colors.black,
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.medium,
  },
  switchContainer: {
    width: '93%',
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logoutButton: {
    width: '90%',
    alignSelf: 'center',
    marginTop: '10%',
  },
  logoutButtonText: {
    color: Colors.red_700,
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.large,
  },
});
