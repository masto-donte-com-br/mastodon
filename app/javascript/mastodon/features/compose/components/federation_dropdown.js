import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import IconButton from '../../../components/icon_button';
import Overlay from 'react-overlays/Overlay';
import { supportsPassiveEvents } from 'detect-passive-events';
import classNames from 'classnames';
import Icon from 'mastodon/components/icon';

const messages = defineMessages({
  federate_short: { id: 'federation.federated.short', defaultMessage: 'Federated' },
  federate_long: { id: 'federation.federated.long', defaultMessage: 'Allow toot to reach other instances' },
  local_only_short: { id: 'federation.local_only.short', defaultMessage: 'Local-only' },
  local_only_long: { id: 'federation.local_only.long', defaultMessage: 'Restrict this toot only to my instance' },
  change_federation: { id: 'federation.change', defaultMessage: 'Adjust status federation' },
});

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

const getValue = element => element.dataset.index === 'true';

class FederationDropdownMenu extends React.PureComponent {

  static propTypes = {
    style: PropTypes.object,
    items: PropTypes.array.isRequired,
    value: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    mounted: false,
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  };

  handleKeyDown = e => {
    const { items } = this.props;
    const value = getValue(e.currentTarget);
    const index = items.findIndex(item => {
      return (item.value === value);
    });
    let element;

    switch(e.key) {
    case 'Escape':
      this.props.onClose();
      break;
    case 'Enter':
      this.handleClick(e);
      break;
    case 'ArrowDown':
      element = this.node.childNodes[index + 1];
      if (element) {
        element.focus();
        this.props.onChange(getValue(element));
      }
      break;
    case 'ArrowUp':
      element = this.node.childNodes[index - 1];
      if (element) {
        element.focus();
        this.props.onChange(getValue(element));
      }
      break;
    case 'Home':
      element = this.node.firstChild;
      if (element) {
        element.focus();
        this.props.onChange(getValue(element));
      }
      break;
    case 'End':
      element = this.node.lastChild;
      if (element) {
        element.focus();
        this.props.onChange(getValue(element));
      }
      break;
    }
  }

  handleClick = e => {
    e.preventDefault();

    this.props.onClose();
    this.props.onChange(getValue(e.currentTarget));
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
    if (this.focusedItem) this.focusedItem.focus();
    this.setState({ mounted: true });
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  };

  setFocusRef = c => {
    this.focusedItem = c;
  };

  render () {
    const { mounted } = this.state;
    const { style, items, value } = this.props;

    return (
      <div style={{ ...style }} role='listbox' ref={this.setRef}>
        {items.map(item => (
          <div role='option' tabIndex='0' key={item.value} data-index={item.value} onKeyDown={this.handleKeyDown} onClick={this.handleClick} className={classNames('privacy-dropdown__option', { active: item.value === value })} aria-selected={item.value === value} ref={item.value === value ? this.setFocusRef : null}>
            <div className='privacy-dropdown__option__icon'>
              <Icon id={item.icon} fixedWidth />
            </div>

            <div className='privacy-dropdown__option__content'>
              <strong>{item.text}</strong>
              {item.meta}
            </div>
          </div>
        ))}
      </div>
    );
  }

}

export default @injectIntl
class FederationDropdown extends React.PureComponent {

  static propTypes = {
    isUserTouching: PropTypes.func,
    isModalOpen: PropTypes.bool.isRequired,
    onModalOpen: PropTypes.func,
    onModalClose: PropTypes.func,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  state = {
    open: false,
    placement: 'bottom',
  };

  handleToggle = ({ target }) => {
    if (this.props.isUserTouching()) {
      if (this.state.open) {
        this.props.onModalClose();
      } else {
        this.props.onModalOpen({
          actions: this.options.map(option => ({ ...option, active: option.value === this.props.value })),
          onClick: this.handleModalActionClick,
        });
      }
    } else {
      this.setState({ open: !this.state.open });
    }
  };

  handleModalActionClick = (e) => {
    e.preventDefault();

    const { value } = this.options[e.currentTarget.getAttribute('data-index')];

    this.props.onModalClose();
    this.props.onChange(value);
  };

  handleKeyDown = e => {
    switch(e.key) {
    case 'Escape':
      this.handleClose();
      break;
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = value => {
    this.props.onChange(value);
  };

  componentWillMount () {
    const { intl: { formatMessage } } = this.props;

    this.options = [
      { icon: 'link', value: true, text: formatMessage(messages.federate_short), meta: formatMessage(messages.federate_long) },
      { icon: 'chain-broken', value: false, text: formatMessage(messages.local_only_short), meta: formatMessage(messages.local_only_long) },
    ];
  }

  setTargetRef = c => {
    this.target = c;
  };

  findTarget = () => {
    return this.target;
  };

  handleOverlayEnter = (state) => {
    this.setState({ placement: state.placement });
  };

  render () {
    const { value, container, disabled, intl } = this.props;
    const { open, placement } = this.state;

    const valueOption = this.options.find(item => item.value === value);

    return (
      <div className={classNames('privacy-dropdown', placement, { active: open })} onKeyDown={this.handleKeyDown}>
        <div className={classNames('privacy-dropdown__value', { active: this.options.indexOf(valueOption) === 0 })} ref={this.setTargetRef}>
          <IconButton
            className='privacy-dropdown__value-icon'
            icon={valueOption.icon}
            title={intl.formatMessage(messages.change_federation)}
            size={18}
            expanded={open}
            active={open}
            inverted
            onClick={this.handleToggle}
            style={{ height: null, lineHeight: '27px' }}
            disabled={disabled}
          />
        </div>

        <Overlay show={open} placement={'bottom'} flip target={this.findTarget} container={container} popperConfig={{ strategy: 'fixed', onFirstUpdate: this.handleOverlayEnter }}>
          {({ props, placement }) => (
            <div {...props}>
              <div className={`dropdown-animation privacy-dropdown__dropdown ${placement}`}>
                <FederationDropdownMenu
                  items={this.options}
                  value={value}
                  onClose={this.handleClose}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          )}
        </Overlay>
      </div>
    );
  }

}
