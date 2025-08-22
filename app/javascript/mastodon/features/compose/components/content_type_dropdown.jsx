import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl, defineMessages } from 'react-intl';

import classNames from 'classnames';

import Overlay from 'react-overlays/Overlay';

import SmallDescriptionIcon from '@/material-icons/400-20px/description.svg?react';
import SmallMarkdownIcon from '@/material-icons/400-20px/markdown.svg?react';
import DescriptionIcon from '@/material-icons/400-24px/description.svg?react';
import MarkdownIcon from '@/material-icons/400-24px/markdown.svg?react';

import { DropdownSelector } from 'mastodon/components/dropdown_selector';
import { IconButton } from 'mastodon/components/icon_button';

const messages = defineMessages({
  change_content_type: { id: 'compose.content-type.change', defaultMessage: 'Change advanced formatting options' },
  plain_text_label: { id: 'compose.content-type.plain', defaultMessage: 'Plain text' },
  plain_text_meta: { id: 'compose.content-type.plain_meta', defaultMessage: 'Write with no advanced formatting' },
  markdown_label: { id: 'compose.content-type.markdown', defaultMessage: 'Markdown' },
  markdown_meta: { id: 'compose.content-type.markdown_meta', defaultMessage: 'Format your posts using Markdown' }
});

class ContentTypeDropdown extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    container: PropTypes.func,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  state = {
    open: false,
    placement: 'bottom',
  };

  handleToggle = () => {
    if (this.state.open && this.activeElement) {
      this.activeElement.focus({ preventScroll: true });
    }

    this.setState({ open: !this.state.open });
  };

  handleKeyDown = e => {
    switch(e.key) {
    case 'Escape':
      this.handleClose();
      break;
    }
  };

  handleMouseDown = () => {
    if (!this.state.open) {
      this.activeElement = document.activeElement;
    }
  };

  handleButtonKeyDown = (e) => {
    switch(e.key) {
    case ' ':
    case 'Enter':
      this.handleMouseDown();
      break;
    }
  };

  handleClose = () => {
    if (this.state.open && this.activeElement) {
      this.activeElement.focus({ preventScroll: true });
    }
    this.setState({ open: false });
  };

  handleChange = value => {
    this.props.onChange(value);
  };

  UNSAFE_componentWillMount () {
    const { intl: { formatMessage } } = this.props;

    this.options = [
      { icon: 'file-text', iconComponent: DescriptionIcon, value: 'text/plain', text: formatMessage(messages.plain_text_label), meta: formatMessage(messages.plain_text_meta) },
      { icon: 'arrow-circle-down', iconComponent: MarkdownIcon, value: 'text/markdown', text: formatMessage(messages.markdown_label), meta: formatMessage(messages.markdown_meta) },
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
      <div ref={this.setTargetRef} onKeyDown={this.handleKeyDown}>
        <IconButton
          title={intl.formatMessage(messages.change_content_type)}
          aria-expanded={open}
          onClick={this.handleToggle}
          onMouseDown={this.handleMouseDown}
          onKeyDown={this.handleButtonKeyDown}
          disabled={disabled}
          className={classNames({ active: open })}
          iconComponent={valueOption.iconComponent}
        />

        <Overlay show={open} offset={[5, 5]} placement={placement} flip target={this.findTarget} container={container} popperConfig={{ strategy: 'fixed', onFirstUpdate: this.handleOverlayEnter }}>
          {({ props, placement }) => (
            <div {...props}>
              <div className={`dropdown-animation content-type-dropdown__dropdown ${placement}`}>
                <DropdownSelector
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
};

export default injectIntl(ContentTypeDropdown);
