import { useCallback } from 'react';

import { useIntl, defineMessages } from 'react-intl';

import SmallShareIcon from '@/material-icons/400-20px/share.svg?react';
import SmallShareOffIcon from '@/material-icons/400-20px/share_off.svg?react';
import ShareIcon from '@/material-icons/400-24px/share.svg?react';
import ShareOffIcon from '@/material-icons/400-24px/share_off.svg?react';
import { changeComposeFederation } from '../../../actions/compose';
import { useAppDispatch, useAppSelector } from '@/mastodon/store';

import { DropdownIconButton } from './dropdown_icon_button';

const messages = defineMessages({
  federate_short: { id: 'federation.federated.short', defaultMessage: 'Federated' },
  federate_long: { id: 'federation.federated.long', defaultMessage: 'Allow post to reach other instances' },
  local_only_short: { id: 'federation.local_only.short', defaultMessage: 'Local-only' },
  local_only_long: { id: 'federation.local_only.long', defaultMessage: 'Restrict this post only to my instance' },
  change_federation: { id: 'federation.change', defaultMessage: 'Adjust status federation' },
});

export const FederationButton = () => {
  const intl = useIntl();

  const isEditing = useAppSelector((state) => state.getIn(['compose', 'id']) !== null);
  const federation = useAppSelector((state) => state.getIn(['compose', 'federation']));
  const dispatch = useAppDispatch();

  const handleChange = useCallback((value) => {
    // handleChange receives the values as string, therefore we need to convert them
    // to proper JS booleans.
    value = value === "true";

    dispatch(changeComposeFederation(value));
  }, [dispatch]);

  const options = [
    { icon: 'link', iconComponent: ShareIcon, value: true, text: intl.formatMessage(messages.federate_short), meta: intl.formatMessage(messages.federate_long) },
    { icon: 'link-slash', iconComponent: ShareOffIcon, value: false, text: intl.formatMessage(messages.local_only_short), meta: intl.formatMessage(messages.local_only_long) },
  ];

  return (
    <DropdownIconButton
      disabled={isEditing}
      icon={federation ? 'link' : 'link-slash'}
      iconComponent={federation ? SmallShareIcon : SmallShareOffIcon}
      onChange={handleChange}
      options={options}
      title={intl.formatMessage(messages.change_federation)}
      value={federation}
    />
  );
};
