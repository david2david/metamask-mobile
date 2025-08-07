import { StyleSheet } from 'react-native';
import { Colors } from '../../../../util/theme/models';

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 48,
    },
    heading: {
      marginBottom: 24,
    },
    desc: {
      borderBottomColor: colors.border.muted,
      borderBottomWidth: 1,
      paddingBottom: 5,
      paddingHorizontal: 16,
    },
    accessory: {
      marginTop: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      flex: 1,
    },
    switchElement: {
      marginLeft: 16,
    },
    blockaidSwitchElement: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    setting: {
      marginTop: 6,
    },
    firstSetting: {
      marginTop: 0,
    },
    halfSetting: {
      marginTop: 16,
    },
    modalView: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 20,
    },
    modalText: {
      textAlign: 'center',
    },
    modalTitle: {
      textAlign: 'center',
      marginBottom: 20,
    },
    protect: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    col: {
      width: '48%',
    },
    inner: {
      paddingBottom: 112,
    },
    picker: {
      marginTop: 16,
    },
    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    switch: {
      alignSelf: 'flex-start',
    },
    cellBorder: { borderWidth: 0 },
    subHeading: {
      marginTop: 32,
    },
    list: {
      width: '100%',
    },
    listWrapper: {
      flex: 1,
      paddingBottom: 10,
    },
    optionButton: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 35,
    },
    optionLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.text.default,
    },
    icon: {
      paddingHorizontal: 10,
    },
  });

export default createStyles;
