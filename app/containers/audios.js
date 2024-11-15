import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image,
  InteractionManager,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as audioActions from '../actions/audio-actions';
import * as audiosActions from '../actions/audios-actions';
import * as routes from '../routes/routes';
import sc from '../../config/styles';
import NavBar from '../libs/nav-bar';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';
import { createStackNavigator } from '@react-navigation/stack';

const propTypes = {
	transitionOpacity				: PropTypes.object.isRequired,
};

const Stack = createStackNavigator();

class Audios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: "row",
    };

		this._feedView = null;
    this._playingOpacity = new Animated.Value(1);

		this.selectFilter = this.selectFilter.bind(this);
  }

	componentDidMount() {
		this.selectFilter(this.props.filter);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.currentAudioMode !== nextProps.currentAudioMode) {
      if (nextProps.currentAudioMode === 'play' || nextProps.currentAudioMode === 'pause') {
        InteractionManager.runAfterInteractions(() => {
          Animated.timing(this._playingOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        });
      }
      else {
        InteractionManager.runAfterInteractions(() => {
          Animated.timing(this._playingOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        });
      }
    }
  }

	//////////////////////
	// Public Functions //
	//////////////////////

	selectFilter(filter) {
		this.props.audiosActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.audiosActions.loadFeed(filter);
		}
		// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
	}

	///////////////
	// Functions //
	///////////////
  onLayoutChange() {
    //this.props.audioActions.stop(currentAudioObject)
    if (this.state.layout === "row") {
      this.setState({ layout: "grid" });
    }
    else {
      this.setState({ layout: "row" });
    }
  }

  renderPlaying() {
		const { currentAudioObject, currentAudioMode } = this.props;
    const isPlaying = currentAudioMode === 'play';
    return (
      <Animated.View style={ [styles.containerPlayer, {opacity: this._playingOpacity}] }>
        <View style={styles.containerTitle}>
          <Text style={styles.textLabel}>Now playing:</Text>
          <Text style={styles.textTitle}>{ currentAudioObject.title } { currentAudioObject.length }</Text>
        </View>
        <View style={styles.containerControls}>
          <TouchableWithoutFeedback
            onPress={() => isPlaying
              ? this.props.audioActions.pause(currentAudioObject)
              : this.props.audioActions.play(currentAudioObject)}>
            <Image
              style={styles.imageControl}
              source={ isPlaying
                ? require('../../images/cell/pause-hl-64.png')
                : require('../../images/cell/play-hl-64.png')} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.audioActions.stop(currentAudioObject)}>
            <Image
              style={styles.imageControl}
              source={require('../../images/cell/stop-64.png')} />
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    );
  }

  render() {
		const { transitionOpacity, logoUrl, data, filter, filters, currentAudioObject } = this.props;
		const transitionAnimatedStyles = [styles.sceneContainer, {opacity: transitionOpacity}];
		const route = routes.audios();
    const titleButton = (
      <Image
        style={styles.imageNav}
        source={this.state.layout === "row"
          ? require('../../images/nav/row-64.png')
          : require('../../images/nav/grid-64.png')} />
    );
    const onPress = () => this.onLayoutChange();
    return (
			<View style={styles.container}>
          <NavBar title={route.title} logoUrl={logoUrl}/>
          <Animated.View style={transitionAnimatedStyles}>
            <SlidingTabBarView
              filter={filter}
              filters={filters}
              onPressFilter={(selected) => this.selectFilter(selected)}
            />
            {currentAudioObject && this.renderPlaying()}
            <FeedView
              ref={(component) => (this._feedView = component)}
              routeId={route.id}
              data={data[filter]}
              layout={this.state.layout}
            />
          </Animated.View>
			</View>
    );
  }

}

Audios.propTypes = propTypes;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerPlayer: {
		justifyContent: 'space-between',
		flexDirection: 'row',
    backgroundColor: sc.colors.backgroundGray,
    padding: 10,
	},
	containerTitle: {
    justifyContent: 'center',
	},
	containerControls: {
		flexDirection: 'row',
	},
	sceneContainer: {
		flex: 1,
	},
	textLabel: {
		...sc.text,
		fontSize: 15,
	},
	textTitle: {
		...sc.textBold,
		fontSize: 18,
	},
	imageControl: {
		width: 52,
		height: 52,
		marginLeft: 10,
	},
	imageNav: {
		width: 14,
		height: 14,
		marginTop: 2,
		marginLeft: 5,
	},
});

export default connect(state => ({
		logoUrl			        : state.app.school.logo_image_link,
		data				        : state.audios.data,
		filter			        : state.audios.filter,
		filters			        : state.audios.filters,
		isLoading		        : state.audios.is_loading,
    currentAudioObject  : state.audio.object,
    currentAudioMode    : state.audio.mode,
	}),
	dispatch => ({
		audioActions	: bindActionCreators(audioActions, dispatch),
		audiosActions	: bindActionCreators(audiosActions, dispatch),
	})
)(Audios);
