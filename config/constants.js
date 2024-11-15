// TODO
export const APP_API_HOST = 'http://stressbusters-api.us-east-1.elasticbeanstalk.com/';
//export const APP_API_HOST = 'http://localhost:9001/';
//export const APP_API_HOST = 'http://api.stress.dev/';
export const APP_VERSION = '1';
export const IN_PRODUCTION = ! __DEV__;
export const SPLASH_SCREEN_WAIT = IN_PRODUCTION ? 1500 : 100;

export const CONTACT_EMAIL = 'info@thestresscoach.com';

export const SUBSCRIPTION_IDENTIFIER_MONTHLY = 'com.stressbusterscentral.calmcast.content';
export const SUBSCRIPTION_IDENTIFIER_ANNUALLY = 'com.stressbusterscentral.calmcast.contentAnnual';
export const SUBSCRIPTION_IDENTIFIER_ANDROID_MONTHLY = 'content';
export const SUBSCRIPTION_IDENTIFIER_ANDROID_ANNUALLY = 'content.annual';
export const LOCATION_ID_CALMCAST = 'flG8IMCMPi';
export const LOCATION_ID_X93 = 'aZdPo2jYLF';
export const LOCATION_ID_SMH = 'YQNIKNUY6M';
export const LOCATION_ID_MICHIGAN = '5MkaBR5zzQ';
export const LOCATION_ID_TOLEDO = 'd7Q3kDu225';
export const LOCATION_ID_BKS = 'm9ur7owxeH';

export const SELECTED_OBJECT_MODE_ALL = 'SELECTED_OBJECT_MODE_ALL';
export const SELECTED_OBJECT_MODE_SHARE = 'SELECTED_OBJECT_MODE_SHARE';
export const SELECTED_OBJECT_MODE_MORE = 'SELECTED_OBJECT_MODE_MORE';

export const SCREEN_NAME_MAX_LENGTH = 20;

export const APP_TYPES = {
  SB      : {name:'Stressbusters'},
  PENN    : {name:'Penn Wellness'},
  CALMCAST: {name:'Calmcast'},
};

export const REMINDER_VOICES = {
  "Eat lunch": "APP-REM Eat lunch.wav",
  "Anita is ready for your Breather session.": "APP-REM Anita is ready for Breather session.wav",
  "Be mindful": "APP-REM Be mindful.wav",
  "Check your Dashboard (scan for stress)": "APP-REM Check your dashboard.wav",
  "Chill with one of your Rapid Relaxers": "APP-REM Chill with one of your Rapid Relaxers.wav",
  "Correct your posture": "APP-REM Correct your posture.wav",
  "Damien is ready for your Breather session": "APP-REM Damien is ready Breather session.wav",
  "Good morning. It's going to be a great day!": "APP-REM Good morning. It's gonna be a great day..wav",
  "Hydrate": "APP-REM Hydrate.wav",
  "Serena is ready for your Breather session.": "APP-REM Serena is ready Breather session.wav",
  "Stand up and move around": "APP-REM Stand up and move around.wav",
  "Stretch": "APP-REM Stretch.wav",
  "Take a break": "APP-REM Take a break.wav",
  "Take a device break": "APP-REM Take a device break.wav",
  "Take a nap": "APP-REM Take a nap.wav",
  "Things will get easier.": "APP-REM Things will get easier.wav",
  "Think about a peaceful place": "APP-REM Think about a peaceful place.wav",
  "You are amazing.": "APP-REM You are amazing.wav",
  "You are loved.": "APP-REM You are loved by a lot of people.wav",
  "You are more than your grades.": "APP-REM You are more than your grades.wav",
  "You are more than your job.": "APP-REM You are more than your job.wav",
};

export const NOTE_TYPES = {
  Note    : {name:'Note'    , category: 'Notes'},
  Journal : {name:'Journal' , category: 'Journal'},
  Goal    : {name:'Goal'    , category: 'Goals'},
  Resource: {name:'Resource', category: 'Resources'},
};

export const AMPLITUDE_API_KEY = __DEV__
  ? '699c6a4f5772c029e3eadcb7b3736bbc'
  : 'ea62b8fd540fe40f6e5a7e75e35e4422';
export const SEGMENT_API_KEY = __DEV__
  ? 'YWhCNiNbeNn7WZnBkyUXekS3i4mf0WoM'
  : 'VjtThfHQmsUGsn6S8qxS39gdYcquKAEk';
export const MIXPANEL_TOKEN = __DEV__
  ? '755043834a431de5ee06603450a0a0ba'
  : 'c3ba01188dee21795f266089bfdfa21b';
