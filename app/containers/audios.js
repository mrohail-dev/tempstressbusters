//ORIGINAL

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
	transitionOpacity: PropTypes.object.isRequired,
};

const Stack = createStackNavigator();

class Audios extends Component {
  constructor(props) {
    super(props);
		this._chromeOpacity = new Animated.Value(0);
    this.state = {
      layout: "row",
      currentIndex:0,
      rerender:0

    };
    this._lastScrollY = 0;
		this._feedView = null;
    this._playingOpacity = new Animated.Value(1);

		this.selectFilter = this.selectFilter.bind(this);
  }

  componentDidUpdate(prevProps){
    if(prevProps.filter !== this.props.filter){
      this.setState({
        currentIndex:0
      })
    }
  }

	componentDidMount() {
		this.selectFilter(this.props.filter);
    
	}
  
  componentWillUnmount(){
    const isPlaying = this.props.currentAudioMode === 'play';
    if(isPlaying){
      this.props.audioActions.stop();
    }
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
  scrollToPlayingSong(audioObject) {
    if (this._feedView && this.props.data[this.props.filter] && audioObject) {
      const index = this.props.data[this.props.filter].findIndex(
        (item) => item.id === audioObject.id
      );
      // if(this.state.rerender<3){}
      if (index !== -1) {
        this._feedView._listView.scrollToIndex({
          index,
          animated:false
        })
      }
    }
  }  
  selectFilter(filter) {
    const { audiosActions, data, currentAudioObject } = this.props;
  
    // Set the selected filter
    audiosActions.selectFilter(filter);
  
    // Load data if not already present for the selected filter
    if (!data[filter]) {
      audiosActions.loadFeed(filter);
      console.log("loading")
    } else {
      if(this.props.data){
        this.scrollToPlayingSong(currentAudioObject);

      }
      // console.log(`Data for filter "${filter}" already loaded:`, data[filter]);
      console.log("already loaded")
    }
  
    // Scroll to top if applicable
    // if (this._feedView && this._lastScrollY === 0) {
    //   this._feedView.scrollTo({ y: 0, animated: false });
    //   console.log("scrolling")
    // }
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
  handleScroll = (event) => {
    // Save the scroll offset on scroll
    const offset = event.nativeEvent.contentOffset.y;
    // if (ref && ref.scrollToOffset) {
    //   ref.scrollToOffset(offset);
    // } else {
    //   console.warn('FeedView ref is not available or does not support scrollToOffset');
    // }
    // this._feedView.scrollTo({ offset: offset, animated: false });
  };
  scrollToOffset = (offset) => {
    if (this._feedView && typeof this._feedView.scrollToOffset === 'function') {
      this._feedView.scrollToOffset({ offset, animated: true });
    } else {
      console.warn('FlatList ref is not available or does not support scrollToOffset');
    }
  };
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
            onPress={() => {
              const isPlaying = currentAudioMode === 'play';
              if (isPlaying) {
                this.props.audioActions.pause(currentAudioObject);
              } else {
                this.props.audioActions.play(currentAudioObject);
              }
            }}>
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
    const transitionAnimatedStyles = [styles.sceneContainer, { opacity: transitionOpacity }];
    const route = routes.audios();
    console.log('Rendering FeedView with currentIndex:', this.state.currentIndex);

    return (
      <View style={styles.container}>
        <NavBar navtitle={route.title} logoUrl={logoUrl} />
  
        <Animated.View style={transitionAnimatedStyles}>
          {/* Render tab bar */}
          <SlidingTabBarView
            filter={filter}
            filters={filters}
            onPressFilter={(selected) => this.selectFilter(selected)}
          />
  
          {/* Render current playing audio */}
          {currentAudioObject && this.renderPlaying()}
  
          {/* Render feed view */}


          {data[filter] ? (
            
            <FeedView
              ref={(component) => {
                (this._feedView = component)
              }}
              currentIndex={this.state.currentIndex}
              // force={()=>{
              //   this.selectFilter(this.props.filter);
              // }}
              
              routeId={route.id}
              data={data[filter]} // Pass loaded data
              layout={this.state.layout}
            />
          ) : (
            // Render a loading or fallback message
            <View style={{top:"50%"}}>
            <Text style={{display:"flex",textAlign:"center",alignItems:"center", color:"white"}}>Loading songs...</Text>
          </View>
          )}
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


//POSITION MANTAINED ON PLAY BUT GOING WILD ON PAUSE BUTTON

// import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import {
//   Animated,
//   Image,
//   InteractionManager,
//   StyleSheet,
//   View,
//   Text,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as audioActions from '../actions/audio-actions';
// import * as audiosActions from '../actions/audios-actions';
// import * as routes from '../routes/routes';
// import sc from '../../config/styles';
// import NavBar from '../libs/nav-bar';
// import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
// import FeedView from '../components/feed/feed';
// import { createStackNavigator } from '@react-navigation/stack';

// const propTypes = {
// 	transitionOpacity				: PropTypes.object.isRequired,
// };

// const Stack = createStackNavigator();

// class Audios extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       layout: "row",
//     };

// 		this._feedView = null;
//     this._playingOpacity = new Animated.Value(1);

// 		this.selectFilter = this.selectFilter.bind(this);
//   }

// 	componentDidMount() {
// 		this.selectFilter(this.props.filter);
// 	}

// 	UNSAFE_componentWillReceiveProps(nextProps) {
// 		if (this.props.currentAudioMode !== nextProps.currentAudioMode) {
//       if (nextProps.currentAudioMode === 'play' || nextProps.currentAudioMode === 'pause') {
//         InteractionManager.runAfterInteractions(() => {
//           Animated.timing(this._playingOpacity, {
//             toValue: 1,
//             duration: 600,
//             useNativeDriver: true,
//           }).start();
//         });
//       }
//       else {
//         InteractionManager.runAfterInteractions(() => {
//           Animated.timing(this._playingOpacity, {
//             toValue: 0,
//             duration: 100,
//             useNativeDriver: true,
//           }).start();
//         });
//       }
//     }
//   }

// 	//////////////////////
// 	// Public Functions //
// 	//////////////////////

//   selectFilter(filter) {
//     const { audiosActions, data } = this.props;
  
//     // Set the selected filter
//     audiosActions.selectFilter(filter);
  
//     // Load data if not already present for the selected filter
//     if (!data[filter]) {
//       audiosActions.loadFeed(filter);
//     } else {
//       console.log(`Data for filter "${filter}" already loaded:`, data[filter]);
//     }
  
//     // Scroll to top if applicable
//     if (this._feedView) {
//       this._feedView.scrollTo({ y: 0, animated: false });
//     }
//   }
// 	///////////////
// 	// Functions //
// 	///////////////
//   onLayoutChange() {
//     //this.props.audioActions.stop(currentAudioObject)
//     if (this.state.layout === "row") {
//       this.setState({ layout: "grid" });
//     }
//     else {
//       this.setState({ layout: "row" });
//     }
//   }

//   renderPlaying() {
//     const { currentAudioObject, currentAudioMode } = this.props;
//     const isPlaying = currentAudioMode === 'play';
  
//     return (
//       <Animated.View style={[styles.containerPlayer, { opacity: this._playingOpacity }]}>
//         <View style={styles.containerTitle}>
//           <Text style={styles.textLabel}>Now playing:</Text>
//           <Text style={styles.textTitle}>
//             {currentAudioObject.title} {currentAudioObject.length}
//           </Text>
//         </View>
//         <View style={styles.containerControls}>
//           <TouchableWithoutFeedback
//             onPress={() => {
//               const isCurrentlyPlaying = currentAudioMode === 'play';
//               // Update audio state without affecting the screen's position
//               if (isCurrentlyPlaying) {
//                 this.props.audioActions.pause(currentAudioObject);
//               } else {
//                 this.props.audioActions.play(currentAudioObject);
//               }
//             }}
//           >
//             <Image
//               style={styles.imageControl}
//               source={
//                 isPlaying
//                   ? require('../../images/cell/pause-hl-64.png')
//                   : require('../../images/cell/play-hl-64.png')
//               }
//             />
//           </TouchableWithoutFeedback>
//           <TouchableWithoutFeedback
//             onPress={() => this.props.audioActions.stop(currentAudioObject)}
//           >
//             <Image
//               style={styles.imageControl}
//               source={require('../../images/cell/stop-64.png')}
//             />
//           </TouchableWithoutFeedback>
//         </View>
//       </Animated.View>
//     );
//   }

//   render() {
//     const { transitionOpacity, logoUrl, data, filter, filters, currentAudioObject } = this.props;
//     const transitionAnimatedStyles = [styles.sceneContainer, { opacity: transitionOpacity }];
//     const route = routes.audios();
  
//     return (
//       <View style={styles.container}>
//         <NavBar title={route.title} logoUrl={logoUrl} />
  
//         <Animated.View style={transitionAnimatedStyles}>
//           {/* Render tab bar */}
//           <SlidingTabBarView
//             filter={filter}
//             filters={filters}
//             onPressFilter={(selected) => this.selectFilter(selected)}
//           />
  
//           {/* Render current playing audio */}
//           {currentAudioObject && this.renderPlaying()}
  
//           {/* Render feed view */}
//           {data[filter] ? (
//             <FeedView
//               ref={(component) => (this._feedView = component)}
//               routeId={route.id}
//               data={data[filter]} // Pass loaded data
//               layout={this.state.layout}
//             />
//           ) : (
//             // Render a loading or fallback message
//             <View style={styles.loadingContainer}>
//               <Text style={styles.loadingText}>Loading songs...</Text>
//             </View>
//           )}
//         </Animated.View>
//       </View>
//     );
//   }
// }

// Audios.propTypes = propTypes;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 	},
// 	containerPlayer: {
// 		justifyContent: 'space-between',
// 		flexDirection: 'row',
//     backgroundColor: sc.colors.backgroundGray,
//     padding: 10,
// 	},
// 	containerTitle: {
//     justifyContent: 'center',
// 	},
// 	containerControls: {
// 		flexDirection: 'row',
// 	},
// 	sceneContainer: {
// 		flex: 1,
// 	},
// 	textLabel: {
// 		...sc.text,
// 		fontSize: 15,
// 	},
// 	textTitle: {
// 		...sc.textBold,
// 		fontSize: 18,
// 	},
// 	imageControl: {
// 		width: 52,
// 		height: 52,
// 		marginLeft: 10,
// 	},
// 	imageNav: {
// 		width: 14,
// 		height: 14,
// 		marginTop: 2,
// 		marginLeft: 5,
// 	},
// });

// export default connect(state => ({
// 		logoUrl			        : state.app.school.logo_image_link,
// 		data				        : state.audios.data,
// 		filter			        : state.audios.filter,
// 		filters			        : state.audios.filters,
// 		isLoading		        : state.audios.is_loading,
//     currentAudioObject  : state.audio.object,
//     currentAudioMode    : state.audio.mode,
// 	}),
// 	dispatch => ({
// 		audioActions	: bindActionCreators(audioActions, dispatch),
// 		audiosActions	: bindActionCreators(audiosActions, dispatch),
// 	})
// )(Audios);


// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Animated,
//   Image,
//   InteractionManager,
//   StyleSheet,
//   View,
//   Text,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as audioActions from '../actions/audio-actions';
// import * as audiosActions from '../actions/audios-actions';
// import * as routes from '../routes/routes';
// import sc from '../../config/styles';
// import NavBar from '../libs/nav-bar';
// import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
// import FeedView from '../components/feed/feed';
// import { createStackNavigator } from '@react-navigation/stack';

// const propTypes = {
//   transitionOpacity: PropTypes.object.isRequired,
// };

// const Stack = createStackNavigator();

// class Audios extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       layout: 'row',
//     };

//     this._feedView = null; // Reference to the FlatList
//     this._playingOpacity = new Animated.Value(1);
//   }

//   componentDidMount() {
//     this.selectFilter(this.props.filter);
//   }

//   UNSAFE_componentWillReceiveProps(nextProps) {
//     if (this.props.currentAudioMode !== nextProps.currentAudioMode) {
//       if (nextProps.currentAudioMode === 'play' || nextProps.currentAudioMode === 'pause') {
//         InteractionManager.runAfterInteractions(() => {
//           Animated.timing(this._playingOpacity, {
//             toValue: 1,
//             duration: 600,
//             useNativeDriver: true,
//           }).start();
//         });
//       } else {
//         InteractionManager.runAfterInteractions(() => {
//           Animated.timing(this._playingOpacity, {
//             toValue: 0,
//             duration: 100,
//             useNativeDriver: true,
//           }).start();
//         });
//       }
//     }
//   }

//   //////////////////////
//   // Public Functions //
//   //////////////////////

//   selectFilter(filter) {
//     const { audiosActions, data } = this.props;

//     // Set the selected filter
//     audiosActions.selectFilter(filter);

//     // Load data if not already present for the selected filter
//     if (!data[filter]) {
//       audiosActions.loadFeed(filter);
//     }
//   }

//   handleScroll = (event) => {
//     // Save the scroll offset on scroll
//     const offset = event.nativeEvent.contentOffset.y;
//     this.setState({ scrollOffset: offset });
//   };

//   restoreScrollPosition = () => {
//     if (this._feedView) {
//       // Restore the previous scroll position
//       this._feedView.scrollToOffset({ offset: this.state.scrollOffset, animated: false });
//     }
//   };  
  // scrollToPlayingSong(audioObject) {
  //   if (this._feedView && this.props.data[this.props.filter]) {
  //     const index = this.props.data[this.props.filter].findIndex(
  //       (item) => item.id === audioObject.id
  //     );

  //     if (index !== -1) {
  //       // Scroll the FlatList to the item at the found index
  //       this._feedView.scrollToIndex({
  //         index,
  //         animated: true,
  //         viewPosition: 0, // Align the item at the top
  //       });
  //     }
  //   }
  // }  

//   // Function to handle play button press
//   handlePlayButtonPress(audioObject) {
//     const { audioActions, currentAudioObject } = this.props;

//     if (audioObject.id === currentAudioObject?.id) {
//       audioActions.togglePlay(audioObject);
//     } else {
//       audioActions.play(audioObject);

//       // Scroll to the currently playing song
//       this.scrollToPlayingSong(audioObject);
//     }
//   }

//   renderPlaying() {
//     const { currentAudioObject, currentAudioMode } = this.props;
//     const isPlaying = currentAudioMode === 'play';

//     return (
//       <Animated.View style={[styles.containerPlayer, { opacity: this._playingOpacity }]}>
//         <View style={styles.containerTitle}>
//           <Text style={styles.textLabel}>Now playing:</Text>
//           <Text style={styles.textTitle}>
//             {currentAudioObject.title} {currentAudioObject.length}
//           </Text>
//         </View>
//         <View style={styles.containerControls}>
//           <TouchableWithoutFeedback
//             onPress={() => this.handlePlayButtonPress(currentAudioObject)}
//           >
//             <Image
//               style={styles.imageControl}
//               source={
//                 isPlaying
//                   ? require('../../images/cell/pause-hl-64.png')
//                   : require('../../images/cell/play-hl-64.png')
//               }
//             />
//           </TouchableWithoutFeedback>
//           <TouchableWithoutFeedback
//             onPress={() => this.props.audioActions.stop(currentAudioObject)}
//           >
//             <Image
//               style={styles.imageControl}
//               source={require('../../images/cell/stop-64.png')}
//             />
//           </TouchableWithoutFeedback>
//         </View>
//       </Animated.View>
//     );
//   }

//   render() {
//     const { transitionOpacity, logoUrl, data, filter, filters, currentAudioObject } = this.props;
//     const transitionAnimatedStyles = [styles.sceneContainer, { opacity: transitionOpacity }];
//     const route = routes.audios();

//     return (
//       <View style={styles.container}>
//         <NavBar title={route.title} logoUrl={logoUrl} />

//         <Animated.View style={transitionAnimatedStyles}>
//           {/* Render tab bar */}
//           <SlidingTabBarView
//             filter={filter}
//             filters={filters}
//             onPressFilter={(selected) => this.selectFilter(selected)}
//           />

//           {/* Render current playing audio */}
//           {currentAudioObject && this.renderPlaying()}

//           {/* Render feed view */}
//           {data[filter] ? (
//             <FeedView
//               ref={(component) => (this._feedView = component)}
//               routeId={route.id}
//               data={data[filter]}
//               layout={this.state.layout}
//               onScroll={(event) => this.handleScroll(event)} // Optional scroll handling
//             />
//           ) : (
//             // Render a loading or fallback message
//             <View style={styles.loadingContainer}>
//               <Text style={styles.loadingText}>Loading songs...</Text>
//             </View>
//           )}
//         </Animated.View>
//       </View>
//     );
//   }
// }


// Audios.propTypes = propTypes;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   containerPlayer: {
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     backgroundColor: sc.colors.backgroundGray,
//     padding: 10,
//   },
//   containerTitle: {
//     justifyContent: 'center',
//   },
//   containerControls: {
//     flexDirection: 'row',
//   },
//   sceneContainer: {
//     flex: 1,
//   },
//   textLabel: {
//     ...sc.text,
//     fontSize: 15,
//   },
//   textTitle: {
//     ...sc.textBold,
//     fontSize: 18,
//   },
//   imageControl: {
//     width: 52,
//     height: 52,
//     marginLeft: 10,
//   },
//   imageNav: {
//     width: 14,
//     height: 14,
//     marginTop: 2,
//     marginLeft: 5,
//   },
// });

// export default connect(
//   (state) => ({
//     logoUrl: state.app.school.logo_image_link,
//     data: state.audios.data,
//     filter: state.audios.filter,
//     filters: state.audios.filters,
//     isLoading: state.audios.is_loading,
//     currentAudioObject: state.audio.object,
//     currentAudioMode: state.audio.mode,
//   }),
//   (dispatch) => ({
//     audioActions: bindActionCreators(audioActions, dispatch),
//     audiosActions: bindActionCreators(audiosActions, dispatch),
//   })
// )(Audios);
