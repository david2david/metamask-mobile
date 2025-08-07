import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../util/theme';
import ListItem from '../../../component-library/components/List/ListItem/ListItem';
import ListItemColumn, {
  WidthType,
} from '../../../component-library/components/List/ListItemColumn';
import Text, {
  TextVariant,
  TextColor,
} from '../../../component-library/components/Texts/Text';
import { ThemeColors } from '@metamask/design-tokens';

const createStyles = (colors: ThemeColors, titleColor: TextColor) =>
  StyleSheet.create({
    root: {
      backgroundColor: colors.background.default,
      padding: 16,
      opacity: 0.7,
    },
  });

const propTypes = {
  title: PropTypes.string,
  /**
   * Title color
   */
  titleColor: PropTypes.string,
};

const defaultProps = {
  onPress: undefined,
};

const SettingsColumn = ({
  title = '',
  titleColor = TextColor.Default,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, titleColor);
  return (
    <TouchableOpacity>
      <ListItem style={styles.root} gap={16}>
        <ListItemColumn widthType={WidthType.Fill}>
          <Text variant={TextVariant.BodyXS} color={titleColor}>
            {title}
          </Text>
        </ListItemColumn>
      </ListItem>
    </TouchableOpacity>
  );
};

SettingsColumn.propTypes = propTypes;
SettingsColumn.defaultProps = defaultProps;

export default SettingsColumn;
