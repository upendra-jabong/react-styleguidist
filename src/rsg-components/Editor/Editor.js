import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/jsx/jsx';

// We’re explicitly specifying Webpack loaders here so we could skip specifying them in Webpack configuration.
// That way we could avoid clashes between our loaders and user loaders.
// eslint-disable-next-line import/no-unresolved
require('!!../../../loaders/style-loader!../../../loaders/css-loader!codemirror/lib/codemirror.css');
// eslint-disable-next-line import/no-unresolved
require('!!../../../loaders/style-loader!../../../loaders/css-loader!rsg-codemirror-theme.css');

const UPDATE_DELAY = 10;

export default class Editor extends Component {
	static propTypes = {
		code: PropTypes.string.isRequired,
		onChange: PropTypes.func,
		editorConfig: PropTypes.object,
	};
	static contextTypes = {
		config: PropTypes.object.isRequired,
	};

	constructor() {
		super();
		this.handleChange = debounce(this.handleChange.bind(this), UPDATE_DELAY);
	}

	shouldComponentUpdate(nextProps) {
		return !!(this.getEditorConfig(nextProps).readOnly && nextProps.code !== this.props.code);
	}

	getEditorConfig(props) {
		return {
			...this.context.config.editorConfig,
			...props.editorConfig,
		};
	}

	handleChange(editor, metadata, newCode) {
		const { onChange } = this.props;
		if (onChange) {
			onChange(newCode);
		}
	}

	render() {
		const { code } = this.props;
		return (
			<CodeMirror
				value={code}
				onChange={this.handleChange}
				options={this.getEditorConfig(this.props)}
			/>
		);
	}
}
