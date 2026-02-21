import calmBalloonBreath from './calm_balloon_breath.js';
import calmCloudCount from './calm_cloud_count.js';
import calmHeartHug from './calm_heart_hug.js';
import homeKindWords from './home_kind_words.js';
import homeRoutine from './home_routine.js';
import homeTidy from './home_tidy.js';
import parkLostToy from './park_lost_toy.js';
import parkPicnicShare from './park_picnic_share.js';
import parkTurnSlide from './park_turn_slide.js';
import playCrossStreet from './play_cross_street.js';
import playSandcastlePuzzle from './play_sandcastle_puzzle.js';
import playSwingTurns from './play_swing_turns.js';
import shopBagSort from './shop_bag_sort.js';
import shopColorShape from './shop_color_shape.js';
import shopQueueKindness from './shop_queue_kindness.js';
import workFixBirdhouse from './work_fix_birdhouse.js';
import workHelpDelivery from './work_help_delivery.js';
import workToolMatch from './work_tool_match.js';

const all = [
  homeRoutine,
  homeTidy,
  homeKindWords,
  parkTurnSlide,
  parkLostToy,
  parkPicnicShare,
  shopColorShape,
  shopQueueKindness,
  shopBagSort,
  playSandcastlePuzzle,
  playSwingTurns,
  playCrossStreet,
  workFixBirdhouse,
  workToolMatch,
  workHelpDelivery,
  calmBalloonBreath,
  calmCloudCount,
  calmHeartHug,
];

export const EPISODES = Object.fromEntries(all.map((episode) => [episode.id, episode]));

export const EPISODE_LIST = all;
