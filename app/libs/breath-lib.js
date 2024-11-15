export function getBreathMp3Resources(voice) {
  switch (voice) {
    case 'anita':
      return {
        inhale: require('../../audios/breather-inhale-anita-break.mp3'),
        exhale: require('../../audios/breather-exhale-anita-break.mp3'),
      };
    case 'serena':
      return {
        inhale: require('../../audios/breather-inhale-serena.mp3'),
        exhale: require('../../audios/breather-exhale-serena.mp3'),
      };
    case 'aiden':
      return {
        inhale: require('../../audios/breather-inhale-aiden.mp3'),
        exhale: require('../../audios/breather-exhale-aiden.mp3'),
      };
    case 'damien':
      return {
        inhale: require('../../audios/breather-inhale-damien.mp3'),
        exhale: require('../../audios/breather-exhale-damien.mp3'),
      };
    case 'justin':
    default:
      return {
        inhale: require('../../audios/breather-inhale-justin-hale.mp3'),
        exhale: require('../../audios/breather-exhale-justin-hale.mp3'),
      };
  }
}
