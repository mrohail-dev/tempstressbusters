import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundButton from './buttons/background-button';
import sc from '../../config/styles';

const propTypes = {
  options: PropTypes.any,
  onPressItem: PropTypes.func,
  onPressCancel: PropTypes.func,
};

export default class PickerModal extends Component {
  render() {
    const { options } = this.props;
    const styles = this.constructor.styles;
    return (
      <Modal
        visible={true}
        animationType={'slide'}
        transparent={true}
        onRequestClose={() => this.props.onPressCancel()} >
        <View style={styles.container}>
          <BackgroundButton onPress={() => this.props.onPressCancel()} />
          <FlatList
            style={styles.flatlist}
            data={options}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              <TouchableOpacity
                activeOpacity={0.3}
                disabled={!item.enabled}
                style={styles.itemButton}
                onPress={() => this.props.onPressItem(item)}>
                <Text
                  style={[styles.item, { opacity: item.enabled ? 1 : 0.3 }]}
                  enabled={false}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            }
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() =>
              <View style={styles.separator} />
            }
          />
        </View>
      </Modal>
    );
  }
}

PickerModal.propTypes = propTypes;
PickerModal.styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerModalContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  flatlist: {
    flex: 0,
    backgroundColor: sc.colors.white,
    marginVertical: '40%',
    marginHorizontal: '20%',
    borderRadius: 10,
  },
  item: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 30,
    margin: 10,
  },
  separator: {
    height: 1,
    backgroundColor: sc.colors.gray,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
});
