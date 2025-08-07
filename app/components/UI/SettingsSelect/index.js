import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon, {
  IconName,
  IconSize,
} from '../../../component-library/components/Icons/Icon';
import ListItem from '../../../component-library/components/List/ListItem/ListItem';
import ListItemColumn, {
  WidthType,
} from '../../../component-library/components/List/ListItemColumn';
import {
  TextVariant,
} from '../../../component-library/components/Texts/Text';
import { fontStyles, baseStyles } from '../../../styles/common';
import Modal from 'react-native-modal';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import IconCheck from 'react-native-vector-icons/MaterialCommunityIcons';
import Device from '../../../util/device';
import { ThemeContext, mockTheme } from '../../../util/theme';
import SelectModal from '../SelectModal';
const ROW_HEIGHT = 35;
const createStyles = (colors) =>
  StyleSheet.create({
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

export default class SettingsSelect extends PureComponent {
  static propTypes = {
    /**
     * Default value to show
     */
    defaultValue: PropTypes.string,
    /**
     * Label for the field
     */
    label: PropTypes.string,
    /**
     * Selected value
     */
    selectedValue: PropTypes.string,
    /**
     *  Available options
     */
    options: PropTypes.array,
    /**
     * Callback for value change
     */
    onValueChange: PropTypes.func,
    testID: PropTypes.string,
  };

  state = {
    pickerVisible: false,
  };

  scrollView = React.createRef();

  onValueChange = (val) => {
    this.props.onValueChange(val);
    setTimeout(() => {
      this.hidePicker();
    }, 1000);
  };

  hidePicker = () => {
    this.setState({ pickerVisible: false });
  };

  showPicker = () => {
    dismissKeyboard();
    this.setState({ pickerVisible: true });
    // If there are more options than 13 (number of items
    // that should fit in a normal screen)
    // then let's scroll to the selected item
    this.props.options.length > 13 &&
      this.props.options.forEach((item, i) => {
        if (item.value === this.props.selectedValue) {
          setTimeout(() => {
            this.scrollView &&
              this.scrollView.current &&
              this.scrollView.current.scrollTo({
                x: 0,
                y: i * ROW_HEIGHT,
                animated: true,
              });
          }, 100);
        }
      });
  };

  getSelectedValue = () => {
    const { options, selectedValue, defaultValue } = this.props;
    const el = options && options.filter((o) => o.value === selectedValue);
    if (el.length && el[0].label) {
      return el[0].label;
    }
    if (defaultValue) {
      return defaultValue;
    }
    return '';
  };

  renderDropdownSelector = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View style={baseStyles.flexGrow}>
        <TouchableOpacity onPress={this.showPicker} testID={this.props.testID}>
          <ListItem style={styles.root}>
            <ListItemColumn widthType={WidthType.Fill}>
              <Text variant={TextVariant.BodySMMedium}>
                {this.props.label}
              </Text>

            </ListItemColumn>
            {/* <ListItemColumn
              widthType={WidthType.Fill}
            >
              <Text style={styles.selectedOption} numberOfLines={1}>
                {this.getSelectedValue()}
              </Text>
            </ListItemColumn> */}
            <ListItemColumn
              widthType={WidthType.Fill}
              style={{ 
                display: 'flex', 
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                }}>
              <Text style={styles.selectedOption} numberOfLines={1}>
                {this.getSelectedValue()}
              </Text>
              <Icon
                style={styles.action}
                size={IconSize.Xss}
                name={IconName.ArrowRight}
              />
            </ListItemColumn>
          </ListItem>

        </TouchableOpacity>
        {/* <Modal
          isVisible={this.state.pickerVisible}
          onBackdropPress={this.hidePicker}
          onBackButtonPress={this.hidePicker}
          style={styles.modal}
          useNativeDriver
          backdropColor={colors.overlay.default}
          backdropOpacity={1}
        >
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
              onPress={this.hidePicker}
            >
              <Icon name={IconName.Close} size={IconSize.Md} style={styles.action} />
            </TouchableOpacity>
            <View style={styles.accesoryBar}>
              <Text style={styles.label}>{this.props.label}</Text>
            </View>
            <ScrollView style={styles.list} ref={this.scrollView}>
              <View style={styles.listWrapper}>
                {this.props.options.map((option) => (
                  <TouchableOpacity
                    // eslint-disable-next-line react/jsx-no-bind
                    onPress={() => this.onValueChange(option.value)}
                    style={styles.optionButton}
                    key={option.key}
                  >
                    <Text style={styles.optionLabel} numberOfLines={1}>
                      {option.label}
                    </Text>
                    {this.props.selectedValue === option.value ? (
                      <IconCheck
                        style={styles.icon}
                        name="check"
                        size={24}
                        color={colors.primary.default}
                      />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal> */}
        <SelectModal
          isVisible={this.state.pickerVisible}
          label={this.props.label}
          selectedValue={this.props.selectedValue}
          options={this.props.options}
          onCancel={this.hidePicker}
          onValueChange={this.onValueChange}
          >
        </SelectModal>
      </View>
    );
  };

  render = () => (
    <View style={baseStyles.flexGrow}>{this.renderDropdownSelector()}</View>
  );
}

SettingsSelect.contextType = ThemeContext;
