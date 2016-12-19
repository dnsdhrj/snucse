import React from 'react';

import {connectModals} from '../utils';
import Editor from './Editor';
import {FileUploadBox} from './boxes';

/*
 * props
 * - onArticleSubmit
 * - id
 */
const ArticleWrite = React.createClass({
  getInitialState() {
    return {index: 0};
  },

  handleArticleSubmit(data) {
    this.props.onArticleSubmit(data);
    this.setState({index: this.state.index + 1});
  },

  render() {
    const {id} = this.props;
    return (
      <div className="article-box">
        <h3>글쓰기</h3>
        <ArticleForm onArticleSubmit={this.handleArticleSubmit} id={id} key={this.state.index}/>
      </div>
    );
  }
});

const ArticleForm = connectModals(React.createClass({
  getInitialState() {
    return {
      title: '',
      content: '',
      renderingMode: 'text',
      files: {} // pairs of (fileId, file obj)
    };
  },

  handleContentChange(value) {
    this.setState({content: value});
  },
  handleModeChange(renderingMode) {
    this.setState({renderingMode});
  },
  handleTitleChange(e) {
    this.setState({title: e.target.value});
  },
  handleFileChange(fileId, newFile) {
    this.setState({
      files: {
        ...this.state.files,
        [fileId]: newFile
      }
    });
  },
  handleFileDelete(fileId) {
    const newFiles = {};
    for (const oldFileId in this.state.files) {
      if (oldFileId != fileId) {
        newFiles[oldFileId] = this.state.files[oldFileId];
      }
    }
    this.setState({
      files: newFiles
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    const profileId = this.props.id;
    const content = this.state.content.trim();
    const title = this.state.title.trim();
    const renderingMode = this.state.renderingMode;
    const files = [];
    for (const fileId in this.state.files) {
      if (Object.hasOwnProperty.call(this.state.files, fileId)) {
        files.push(this.state.files[fileId]);
      }
    }
    if (!content || !title) {
      return;
    }

    this.props.makeCustomModal('confirm', '알림', '글을 작성하시겠습니까?',
      [
        {
          label: '네',
          callback: () => {
            this.props.onArticleSubmit({title, content, renderingMode, profileIds: profileId, files});
            this.props.cancelModal();
          }
        },
        {
          label: '아니오',
          callback: () => {
            this.props.cancelModal();
          }
        }
      ],
      {closable: false}
    );
  },

  render() {
    return (
      <div className="comment-form">
        <form name="article" onSubmit={this.handleSubmit}>
          Title: <input type="text" id="title" name="title" placeholder="title" value={this.state.title} onChange={this.handleTitleChange}/><br/>
          <Editor onChange={this.handleContentChange} onModeChange={this.handleModeChange}/><br/>
          Files: <FileUploadBox id={this.props.id} onFileChange={this.handleFileChange} onFileDelete={this.handleFileDelete}/><br/>
          <button type="submit">글쓰기</button>
        </form>
      </div>
    );
  }
}));

export default ArticleWrite;
