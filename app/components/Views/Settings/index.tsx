import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SettingsDrawer from '../../UI/SettingsDrawer2';
import SettingsColumn from '../../UI/SettingsColumn';
import SettingsSelect from '../../UI/SettingsSelect';
import { getSettingsNavigationOptions } from '../../UI/Navbar';
import I18n, {
    strings,
    getLanguagesCustom,
    setLocale,
} from '../../../../locales/i18n';
import { MetaMetricsEvents } from '../../../core/Analytics';
// import { useSelector } from 'react-redux';
import { useTheme } from '../../../util/theme';
import Routes from '../../../constants/navigation/Routes';
import { Authentication } from '../../../core/';
import { Colors } from '../../../util/theme/models';
import { SettingsViewSelectorsIDs } from '../../../../e2e/selectors/Settings/SettingsView.selectors';
///: BEGIN:ONLY_INCLUDE_IF(external-snaps)
import { createSnapsSettingsListNavDetails } from '../Snaps/SnapsSettingsList/SnapsSettingsList';
///: END:ONLY_INCLUDE_IF
import { TextColor } from '../../../component-library/components/Texts/Text';
import { useMetrics } from '../../../components/hooks/useMetrics';
// import { isNotificationsFeatureEnabled } from '../../../util/notifications';
// import { isTest } from '../../../util/test/utils';
// import { isPermissionsSettingsV1Enabled } from '../../../util/networks';
// import { selectIsEvmNetworkSelected } from '../../../selectors/multichainNetworkController';
// import { selectSeedlessOnboardingLoginFlow } from '../../../selectors/seedlessOnboardingController';

// 切换currency相关代码
import { UserProfileProperty } from '../../../util/metrics/UserSettingsAnalyticsMetaData/UserProfileAnalyticsMetaData.types';
import { MetricsEventBuilder } from '../../../core/Analytics/MetricsEventBuilder';
import { selectCurrentCurrency } from '../../../selectors/currencyRateController';
import Engine from '../../../core/Engine';
import infuraCurrencies from '../../../util/infura-conversion.json';
const sortedCurrencies = infuraCurrencies.objects.sort((a, b) =>
    a.quote.code
        .toLocaleLowerCase()
        .localeCompare(b.quote.code.toLocaleLowerCase()),
);
const infuraCurrencyOptions = sortedCurrencies.map(
    ({ quote: { code, name } }) => ({
        label: `${code.toUpperCase()} - ${name}`,
        key: code,
        value: code,
    }),
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserTraitsWithCurrentCurrency = (currency: string, metrics: any) => {
    // track event and add selected currency to user profile for analytics
    const traits = { [UserProfileProperty.CURRENT_CURRENCY]: currency };
    /* eslint-disable no-console */
    console.log('metrics', metrics)
    metrics?.addTraitsToUser(traits);
    metrics?.trackEvent(
        MetricsEventBuilder.createEventBuilder(MetaMetricsEvents.CURRENCY_CHANGED)
            .addProperties({
                ...traits,
                location: 'app_settings',
            })
            .build(),
    );
};

const languages = getLanguagesCustom();
type Language_Type_Custom = 'en' | 'ja';
const languageOptions = Object.keys(languages).map((key: string) => ({
    value: key,
    label: languages[key as Language_Type_Custom],
    key,
}));

const createStyles = (colors: Colors) =>
    StyleSheet.create({
        wrapper: {
            backgroundColor: colors.background.default,
            flex: 1,
            zIndex: 99999999999999,
        },
    });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Settings = (props: any) => {
    const { colors } = useTheme();
    const { trackEvent, createEventBuilder } = useMetrics();
    const styles = createStyles(colors);
    // TODO: Replace "any" with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const navigation = useNavigation<any>();

    //   const isEvmSelected = useSelector(selectIsEvmNetworkSelected);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = useSelector((state: any) => state);
    const currentCurrency = selectCurrentCurrency(store)
    const selectCurrency = async (currency: string) => {
        const { CurrencyRateController } = Engine.context;
        CurrencyRateController.setCurrentCurrency(currency);
        updateUserTraitsWithCurrentCurrency(currency, props?.metrics);
    };

    const [state, setState] = useState({
        currentLanguage: I18n.locale.substr(0, 2),
    })
    const selectLanguage = (language: string) => {
        if (language === state.currentLanguage) return;
        setLocale(language);
        setState({ currentLanguage: language });
        setTimeout(() => navigation.navigate('Home'), 100);
    };

    const updateNavBar = useCallback(() => {
        navigation.setOptions(
            getSettingsNavigationOptions(strings('app_settings.title'), colors),
        );
    }, [navigation, colors]);

    useEffect(() => {
        updateNavBar();
    }, [updateNavBar]);

    // const onPressGeneral = () => {
    //     trackEvent(createEventBuilder(MetaMetricsEvents.SETTINGS_GENERAL).build());
    //     navigation.navigate('GeneralSettings');
    // };

    // const onPressAdvanced = () => {
    //     trackEvent(createEventBuilder(MetaMetricsEvents.SETTINGS_ADVANCED).build());
    //     navigation.navigate('AdvancedSettings');
    // };

    //   const onPressNotifications = () => {
    //     trackEvent(
    //       createEventBuilder(MetaMetricsEvents.SETTINGS_NOTIFICATIONS).build(),
    //     );
    //     navigation.navigate(Routes.SETTINGS.NOTIFICATIONS);
    //   };

    // const onPressBackupAndSync = () => {
    //     trackEvent(
    //         createEventBuilder(MetaMetricsEvents.SETTINGS_BACKUP_AND_SYNC).build(),
    //     );
    //     navigation.navigate(Routes.SETTINGS.BACKUP_AND_SYNC);
    // };

    const onPressSecurity = () => {
        trackEvent(
            createEventBuilder(
                MetaMetricsEvents.SETTINGS_SECURITY_AND_PRIVACY,
            ).build(),
        );
        trackEvent(
            createEventBuilder(MetaMetricsEvents.VIEW_SECURITY_SETTINGS).build(),
        );
        navigation.navigate('SecuritySettings');
    };
    const onPresssLockTimer = () => {
        trackEvent(
            createEventBuilder(MetaMetricsEvents.SETTINGS_LOCK_TIMER).build(),
        );
        navigation.navigate('LockTimerSettings');
    };
    const onPressNetworks = () => {
        navigation.navigate('NetworksSettings');
    };

    const onPressOnRamp = () => {
        trackEvent(
            createEventBuilder(MetaMetricsEvents.ONRAMP_SETTINGS_CLICKED).build(),
        );
        navigation.navigate(Routes.RAMP.SETTINGS);
    };

    const onPressExperimental = () => {
        trackEvent(
            createEventBuilder(MetaMetricsEvents.SETTINGS_EXPERIMENTAL).build(),
        );
        navigation.navigate('ExperimentalSettings');
    };

    //   const onPressAesCryptoTestForm = () => {
    //     navigation.navigate('AesCryptoTestForm');
    //   };
    //   const onPressInfo = () => {
    //     trackEvent(createEventBuilder(MetaMetricsEvents.SETTINGS_ABOUT).build());
    //     navigation.navigate('CompanySettings');
    //   };

    const onPressContacts = () => {
        navigation.navigate('ContactsSettings');
    };

    const onPressDeveloperOptions = () => {
        navigation.navigate('DeveloperOptions');
    };

    // const goToManagePermissions = () => {
    //     navigation.navigate('PermissionsManager');
    // };

    const goToBrowserUrl = (url: string, title: string) => {
        navigation.navigate('Webview', {
            screen: 'SimpleWebview',
            params: {
                url,
                title,
            },
        });
    };

    ///: BEGIN:ONLY_INCLUDE_IF(external-snaps)
    const onPressSnaps = () => {
        navigation.navigate(...createSnapsSettingsListNavDetails());
    };
    ///: END:ONLY_INCLUDE_IF

    const submitFeedback = () => {
        trackEvent(
            createEventBuilder(
                MetaMetricsEvents.NAVIGATION_TAPS_SEND_FEEDBACK,
            ).build(),
        );
        goToBrowserUrl(
            'https://community.metamask.io/c/feature-requests-ideas/',
            strings('app_settings.request_feature'),
        );
    };

    const showHelp = () => {
        let supportUrl = 'https://support.metamask.io';

        ///: BEGIN:ONLY_INCLUDE_IF(beta)
        supportUrl = 'https://intercom.help/internal-beta-testing/en/';
        ///: END:ONLY_INCLUDE_IF

        goToBrowserUrl(supportUrl, strings('app_settings.contact_support'));
        trackEvent(
            createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_GET_HELP).build(),
        );
    };

    const onPressLock = async () => {
        await Authentication.lockApp({ reset: false, locked: true });
    };

    const lock = () => {
        Alert.alert(
            strings('drawer.lock_title'),
            '',
            [
                {
                    text: strings('drawer.lock_cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: strings('drawer.lock_ok'),
                    onPress: onPressLock,
                },
            ],
            { cancelable: false },
        );
        trackEvent(
            createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_LOGOUT).build(),
        );
    };

    //   let aboutMetaMaskTitle = strings('app_settings.info_title');

    ///: BEGIN:ONLY_INCLUDE_IF(flask)
    //   aboutMetaMaskTitle = strings('app_settings.info_title_flask');
    ///: END:ONLY_INCLUDE_IF

    ///: BEGIN:ONLY_INCLUDE_IF(beta)
    //   aboutMetaMaskTitle = strings('app_settings.info_title_beta');
    ///: END:ONLY_INCLUDE_IF

    //   const oauthFlow = useSelector(selectSeedlessOnboardingLoginFlow);
    return (
        <ScrollView
            style={styles.wrapper}
            testID={SettingsViewSelectorsIDs.SETTINGS_SCROLL_ID}
        >
            <SettingsDrawer
                onPress={lock}
                title={strings('settings.lock_up')}
                testID={SettingsViewSelectorsIDs.GENERAL}
            />
            <SettingsDrawer
                onPress={onPressSecurity}
                title={strings('settings.bank_account')}
                testID={SettingsViewSelectorsIDs.SECURITY}
            />
            <SettingsColumn
                title={strings('settings.preferences')}
            />

            {/* <SettingsDrawer
                onPress={onPressAdvanced}
                title={strings('settings.default_currency')}
                testID={SettingsViewSelectorsIDs.ADVANCED}
            /> */}
            <SettingsSelect
                label={strings('settings.default_currency')}
                selectedValue={currentCurrency}
                onValueChange={selectCurrency}
                options={infuraCurrencyOptions}
            />

            {/* <SettingsDrawer
                onPress={onPressBackupAndSync}
                title={strings('settings.language')}
                testID={SettingsViewSelectorsIDs.BACKUP_AND_SYNC}
            /> */}
            <SettingsSelect
                label={strings('settings.language')}
                selectedValue={state.currentLanguage}
                onValueChange={selectLanguage}
                options={languageOptions}
            />

            <SettingsColumn title={strings('settings.security')} />

            <SettingsDrawer
                onPress={onPresssLockTimer}
                title={strings('settings.lock_timer')}
                testID={SettingsViewSelectorsIDs.PERMISSIONS}
            />

            <SettingsDrawer
                onPress={onPressContacts}
                title={strings('settings.change_password')}
                testID={SettingsViewSelectorsIDs.CONTACTS}
            />

            <SettingsDrawer
                title={strings('settings.import_wallet_via_privacy_key')}
                onPress={onPressNetworks}
                testID={SettingsViewSelectorsIDs.NETWORKS}
            />

            <SettingsDrawer
                title={strings('settings.import_wallet_via_secret_recovery_phrase')}
                onPress={onPressNetworks}
                testID={SettingsViewSelectorsIDs.NETWORKS}
            />
            {
                ///: BEGIN:ONLY_INCLUDE_IF(external-snaps)
            }
            <SettingsDrawer
                title={strings('app_settings.snaps.title')}
                onPress={onPressSnaps}
            />
            {
                ///: END:ONLY_INCLUDE_IF
            }
            <SettingsDrawer
                title={strings('app_settings.fiat_on_ramp.title')}
                onPress={onPressOnRamp}
                testID={SettingsViewSelectorsIDs.ON_RAMP}
            />
            <SettingsDrawer
                title={strings('app_settings.experimental_title')}
                onPress={onPressExperimental}
                testID={SettingsViewSelectorsIDs.EXPERIMENTAL}
            />

            <SettingsColumn title={strings('settings.other')} />

            <SettingsDrawer
                title={strings('settings.deposit_via_wise')}
                onPress={onPressDeveloperOptions}
            />
            <SettingsDrawer
                title={strings('settings.contact_us')}
                onPress={submitFeedback}
                testID={SettingsViewSelectorsIDs.REQUEST}
            />
            <SettingsColumn
                title={strings('settings.resources')}
            />
            <SettingsDrawer
                title={strings('settings.customer_support')}
                onPress={showHelp}
                renderArrowRight={false}
                testID={SettingsViewSelectorsIDs.CONTACT}
            />
            <SettingsDrawer
                title={strings('settings.terms_and_conditions')}
                testID={SettingsViewSelectorsIDs.LOCK}
                titleColor={TextColor.Default}
            />
            <SettingsDrawer
                title={strings('settings.privacy_policy')}
                testID={SettingsViewSelectorsIDs.LOCK}
                titleColor={TextColor.Default}
            />
            <SettingsDrawer
                title={strings('settings.user_manual')}
                testID={SettingsViewSelectorsIDs.LOCK}
            />
            <SettingsDrawer
                title={strings('settings.user_manual')}
                testID={SettingsViewSelectorsIDs.LOCK}
                onPress={lock}
            />
        </ScrollView>
    );
};

export default Settings;
