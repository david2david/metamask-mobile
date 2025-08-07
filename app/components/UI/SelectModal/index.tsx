import React, {useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { useTheme, mockTheme } from '../../../util/theme';
import Device from '../../../util/device';
import Icon, {
  IconName,
  IconSize,
} from '../../../component-library/components/Icons/Icon';
import { fontStyles } from '../../../styles/common';
import IconCheck from 'react-native-vector-icons/MaterialCommunityIcons';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

export interface SelectModalProps {
  isVisible: boolean;
  label: string;
  selectedValue: string;
  options: Array<{ label: string; value: string }>;
  onCancel: () => void;
  onValueChange: (value: string) => void;
}
const colors = mockTheme.colors;
const ROW_HEIGHT = 35;

const styles = StyleSheet.create({
    root: {
      backgroundColor: colors.background.default,
      paddingLeft: 32,
      paddingRight: 32,
      paddingBottom: 5,
    },
    action: {
      paddingLeft: 16,
    },
    warningTag: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center',
      height: 24,
      paddingHorizontal: 8,
      marginTop: 8,
      borderRadius: 12,
      backgroundColor: colors.error.muted,
    },
    warningText: {
      marginLeft: 4,
    },
    menuItemWarningText: {
      color: colors.text.default,
      fontSize: 12,
      ...fontStyles.normal,
    },

    dropdown: {
      flexDirection: 'row',
    },
    iconDropdown: {
      marginTop: 7,
      height: 25,
      justifyContent: 'flex-end',
      textAlign: 'right',
      marginRight: 10,
    },
    selectedOption: {
      flex: 1,
      alignSelf: 'flex-start',
      color: colors.text.default,
      fontSize: 14,
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: 10,
      ...fontStyles.normal,
    },
    accesoryBar: {
      width: '100%',
      paddingTop: 5,
      height: 50,
      borderBottomColor: colors.border.muted,
      borderBottomWidth: 1,
    },
    label: {
      textAlign: 'center',
      flex: 1,
      paddingVertical: 10,
      fontSize: 17,
      ...fontStyles.bold,
      color: colors.text.default,
    },
    modal: {
      margin: 0,
      width: '100%',
      padding: 60,
    },
    modalView: {
      backgroundColor: colors.background.default,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      maxHeight: Device.getDeviceHeight() - 120, // Subtract top and bottom padding
    },
    list: {
      width: '100%',
    },
    optionButton: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: ROW_HEIGHT,
    },
    optionLabel: {
      flex: 1,
      fontSize: 14,
      ...fontStyles.normal,
      color: colors.text.default,
    },
    icon: {
      paddingHorizontal: 10,
    },
    listWrapper: {
      flex: 1,
      paddingBottom: 10,
    },
  });

const SelectModal = (props: SelectModalProps) => {
  const { colors } = useTheme();
  const scrollView = useRef<ScrollView>(null);
  const onValueChange = (val: string) => {
    props.onValueChange(val);
  };
  const showPicker = () => {
    dismissKeyboard();
    // If there are more options than 13 (number of items
    // that should fit in a normal screen)
    // then let's scroll to the selected item
    props.options.length > 13 &&
      props.options.forEach((item, i) => {
        if (item.value === props.selectedValue) {
          setTimeout(() => {
            scrollView &&
              scrollView.current &&
              scrollView.current.scrollTo({
                x: 0,
                y: i * ROW_HEIGHT,
                animated: true,
              });
          }, 100);
        }
      });
  };
  showPicker()
  return (
    <Modal isVisible={props.isVisible}
      onBackdropPress={props.onCancel}
      onBackButtonPress={props.onCancel}
      style={styles.modal}
      useNativeDriver
      backdropColor={colors.overlay.default}
      backdropOpacity={1}
    >
      <View style={styles.modalView}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
          onPress={props.onCancel}
        >
          <Icon name={IconName.Close} size={IconSize.Md} style={styles.action} />
        </TouchableOpacity>
        < View style={styles.accesoryBar} >
          <Text style={styles.label}> {props.label} </Text>
        </View>
        <ScrollView style={styles.list} ref={scrollView}>
          <View style={styles.listWrapper}>
            {
              props.options.map((option: any) => (
                <TouchableOpacity
                  // eslint-disable-next-line react/jsx-no-bind
                  onPress={() => onValueChange(option.value)}
                  style={styles.optionButton}
                  key={option.key}
                >
                  <Text style={styles.optionLabel} numberOfLines={1} >
                    {option.label}
                  </Text>
                  {
                    props.selectedValue === option.value ? (
                      <IconCheck
                        style={styles.icon}
                        name="check"
                        size={24}
                        color={colors.primary.default}
                      />
                    ) : null
                  }
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

export default SelectModal;
