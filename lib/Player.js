'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _props3 = require('./props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SEEK_ON_PLAY_EXPIRY = 5000;

var Player = function (_Component) {
  _inherits(Player, _Component);

  function Player() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Player);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Player.__proto__ || Object.getPrototypeOf(Player)).call.apply(_ref, [this].concat(args))), _this), _this.mounted = false, _this.isReady = false, _this.isPlaying = false, _this.startOnPlay = true, _this.seekOnPlay = null, _this.onReady = function () {
      if (!_this.mounted) return;
      var _this$props = _this.props,
          onReady = _this$props.onReady,
          playing = _this$props.playing;

      _this.isReady = true;
      _this.loadingSDK = false;
      onReady();
      if (playing) {
        if (_this.loadOnReady) {
          _this.player.load(_this.loadOnReady);
          _this.loadOnReady = null;
        } else {
          _this.player.play();
        }
      }
      _this.onDurationCheck();
    }, _this.onPlay = function () {
      _this.isPlaying = true;
      var _this$props2 = _this.props,
          volume = _this$props2.volume,
          muted = _this$props2.muted,
          onStart = _this$props2.onStart,
          onPlay = _this$props2.onPlay,
          playbackRate = _this$props2.playbackRate;

      if (_this.startOnPlay) {
        if (_this.player.setPlaybackRate) {
          _this.player.setPlaybackRate(playbackRate);
        }
        _this.player.setVolume(muted ? 0 : volume);
        onStart();
        _this.startOnPlay = false;
      }
      onPlay();
      if (_this.seekOnPlay) {
        _this.seekTo(_this.seekOnPlay);
        _this.seekOnPlay = null;
      }
      _this.onDurationCheck();
    }, _this.onPause = function () {
      _this.isPlaying = false;
      _this.props.onPause();
    }, _this.onEnded = function () {
      var _this$props3 = _this.props,
          activePlayer = _this$props3.activePlayer,
          loop = _this$props3.loop,
          onEnded = _this$props3.onEnded;

      if (activePlayer.loopOnEnded && loop) {
        _this.seekTo(0);
      }
      onEnded();
    }, _this.onDurationCheck = function () {
      clearTimeout(_this.durationCheckTimeout);
      var duration = _this.getDuration();
      if (duration) {
        _this.props.onDuration(duration);
      } else {
        _this.durationCheckTimeout = setTimeout(_this.onDurationCheck, 100);
      }
    }, _this.ref = function (player) {
      if (player) {
        _this.player = player;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  } // Track playing state internally to prevent bugs


  _createClass(Player, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.mounted = true;
      this.player.load(this.props.url);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.isReady) {
        this.player.stop();
      }
      this.mounted = false;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props = this.props,
          activePlayer = _props.activePlayer,
          url = _props.url;

      if (prevProps.activePlayer !== activePlayer) {
        this.isReady = false;
        this.seekOnPlay = null;
        this.startOnPlay = true;
        this.player.load(url, this.isReady);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // Invoke player methods based on incoming props
      var _props2 = this.props,
          activePlayer = _props2.activePlayer,
          url = _props2.url,
          playing = _props2.playing,
          volume = _props2.volume,
          muted = _props2.muted,
          playbackRate = _props2.playbackRate;

      if (activePlayer !== nextProps.activePlayer) {
        this.player.stop();
        return; // A new player is coming, so don't invoke any other methods
      }
      if (url !== nextProps.url) {
        this.player.load(nextProps.url, this.isReady);
      }
      if (url && !nextProps.url) {
        this.player.stop();
      }
      if (!playing && nextProps.playing && !this.isPlaying) {
        this.player.play();
      }
      if (playing && !nextProps.playing && this.isPlaying) {
        this.player.pause();
      }
      if (volume !== nextProps.volume && !nextProps.muted) {
        this.player.setVolume(nextProps.volume);
      }
      if (muted !== nextProps.muted) {
        this.player.setVolume(nextProps.muted ? 0 : nextProps.volume);
      }
      if (playbackRate !== nextProps.playbackRate && this.player.setPlaybackRate) {
        this.player.setPlaybackRate(nextProps.playbackRate);
      }
    }
  }, {
    key: 'getCurrentTime',
    value: function getCurrentTime() {
      if (!this.isReady) return null;
      return this.player.getCurrentTime();
    }
  }, {
    key: 'getSecondsLoaded',
    value: function getSecondsLoaded() {
      if (!this.isReady) return null;
      return this.player.getSecondsLoaded();
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      if (!this.isReady) return null;
      return this.player.getDuration();
    }
  }, {
    key: 'seekTo',
    value: function seekTo(amount) {
      var _this2 = this;

      // When seeking before player is ready, store value and seek later
      if (!this.isReady && amount !== 0) {
        this.seekOnPlay = amount;
        setTimeout(function () {
          _this2.seekOnPlay = null;
        }, SEEK_ON_PLAY_EXPIRY);
        return;
      }
      if (amount > 0 && amount < 1) {
        // Convert fraction to seconds based on duration
        var duration = this.player.getDuration();
        if (!duration) {
          console.warn('ReactPlayer: could not seek using fraction – duration not yet available');
          return;
        }
        this.player.seekTo(duration * amount);
        return;
      }
      this.player.seekTo(amount);
    }
  }, {
    key: 'render',
    value: function render() {
      var Player = this.props.activePlayer;
      return _react2['default'].createElement(Player, _extends({}, this.props, {
        ref: this.ref,
        onReady: this.onReady,
        onPlay: this.onPlay,
        onPause: this.onPause,
        onEnded: this.onEnded
      }));
    }
  }]);

  return Player;
}(_react.Component);

Player.displayName = 'Player';
Player.propTypes = _props3.propTypes;
Player.defaultProps = _props3.defaultProps;
exports['default'] = Player;