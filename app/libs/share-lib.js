import { Platform } from 'react-native';
//import Share from 'react-native-share';
//
//export function facebook(text, link, imageLink, cb) {
//		link = (link == '') ? link : imageLink;
//		link = (link == '') ? link : 'http://www.urlname.com';
//		const shareLinkContent = {
//			contentType: 'link',
//			contentUrl: link,
//			contentDescription: text,
//		};
//		FBSDK.ShareDialog
//      .canShow(shareLinkContent).then(
//        function(canShow) {
//          if (canShow) {
//            return FBSDK.ShareDialog.show(shareLinkContent);
//          }
//        }
//      )
//      .then(
//        function(result) {
//          if ( ! result.isCancelled) {
//            cb();
//          }
//        },
//        function(error) { }
//      );
//}
//
//export function twitter(text, link, imageLink, cb) {
//		Share.shareSingle({
//      message: text,
//      url: link,
//			social: 'twitter',
//    });
//}

export function getShareMessage(object, accountType) {
  let parts = [];

  // Get title
  if (object.title) { parts.push(object.title); }

  // Get content
  if (object.content) { parts.push(object.content); }

  // Get url
  if (object.audio_link) { parts.push(object.audio_link); }
//  else if (object.image_link) { parts.push(object.image_link); }
  else if (object.video_link) { parts.push(object.video_link); }
  else if (object.link) { parts.push(object.link); }

  // Get app url
  let appUrl;
  let appName;
  if (accountType === 'school') {
    appName = 'Stressbusters';
    appUrl = 'http://stressbusters.app.link/';
  }
  else {
    appName = 'Calmcast';
    appUrl = 'http://calmcast.app.link/';
  }
  parts.push(`From the ${appName} app ${appUrl}`);

	return parts.join(' - ');
}

export function getShareUrl(object) {
	switch (object.type) {
		case 'audio': return object.audio_link;
		case 'photo': return object.image_link;
		case 'video': return object.video_link;
		case 'message':
			return object.image_link ? object.image_link : '';
		default:
			return object.link ? object.link : '';
	}
}

