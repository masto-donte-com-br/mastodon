import { connect } from 'react-redux';

import { changeComposeContentType } from '../../../actions/compose';
import { openModal, closeModal } from '../../../actions/modal';
import { isUserTouching } from '../../../is_mobile';
import ContentTypeDropdown from '../components/content_type_dropdown';

const mapStateToProps = state => ({
  value: state.getIn(['compose', 'content_type']),
});

const mapDispatchToProps = dispatch => ({

  onChange (value) {
    dispatch(changeComposeContentType(value));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypeDropdown);
