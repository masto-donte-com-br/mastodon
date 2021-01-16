import React from 'react';
import ReactSwipeableViews from 'react-swipeable-views';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Icon from 'mastodon/components/icon';

export const previewState = 'previewMediaModal';

export default @injectIntl
class MediaSlide extends ImmutablePureComponent {

  static propTypes = {
    media: ImmutablePropTypes.list.isRequired,
    status: ImmutablePropTypes.map,
    index: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  state = {
    index: 0,
    navigationHidden: false,
  };

  handleSwipe = (index) => {
    this.setState({ index: index % this.props.media.size });
  }

  handleNextClick = () => {
    this.setState({ index: (this.getIndex() + 1) % this.props.media.size });
  }

  handlePrevClick = () => {
    this.setState({ index: (this.props.media.size + this.getIndex() - 1) % this.props.media.size });
  }

  handleChangeIndex = (e) => {
    const index = Number(e.currentTarget.getAttribute('data-index'));
    this.setState({ index: index % this.props.media.size });
  }

  getIndex () {
    return this.state.index !== null ? this.state.index : this.props.index;
  }

  toggleNavigation = () => {
    this.setState(prevState => ({
      navigationHidden: !prevState.navigationHidden,
    }));
  };

  handleStatusClick = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.context.router.history.push(`/statuses/${this.props.status.get('id')}`);
    }
  }

  render () {
    const { media, status, onClose } = this.props;
    const { navigationHidden } = this.state;

    const index = this.getIndex();
    let pagination = [];

    if (media.size > 1) {
      pagination = media.map((item, i) => {
        const classes = ['media-modal__button'];
        if (i === index) {
          classes.push('media-modal__button--active');
        }
        return (<li className='media-modal__page-dot' key={i}><button tabIndex='0' className={classes.join(' ')} onClick={this.handleChangeIndex} data-index={i}>{i + 1}</button></li>);
      });
    }


    // you can't use 100vh, because the viewport height is taller
    // than the visible part of the document in some mobile
    // browsers when it's address bar is visible.
    // https://developers.google.com/web/updates/2016/12/url-bar-resizing
    const swipeableViewsStyle = {
      width: '100%',
      height: '100%',
    };

    const containerStyle = {
      alignItems: 'center', // center vertically
    };

    const navigationClassName = classNames('media-modal__navigation', {
      'media-modal__navigation--hidden': navigationHidden,
    });

    return (
      <div className='media-modal'>
        <div
          className='media-modal__closer'
          role='presentation'
          onClick={onClose}
        >
          <ReactSwipeableViews
            style={swipeableViewsStyle}
            containerStyle={containerStyle}
            onChangeIndex={this.handleSwipe}
            index={index}
          >
            {media}
          </ReactSwipeableViews>
        </div>

        <div className={navigationClassName}>
          {status && (
            <div className={classNames('media-modal__meta', { 'media-modal__meta--shifted': media.size > 1 })}>
              <a href={status.get('url')} onClick={this.handleStatusClick}><Icon id='comments' /> <FormattedMessage id='lightbox.view_context' defaultMessage='View context' /></a>
            </div>
          )}

          <ul className='media-modal__pagination'>
            {pagination}
          </ul>
        </div>
      </div>
    );
  }

}
