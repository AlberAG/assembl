import React from 'react';
import { Translate } from 'react-redux-i18n';
import { Button } from 'react-bootstrap';

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    const { imgUrl } = this.props;
    this.state = {
      imgName: '',
      imgUrl: imgUrl
    };
    this.handleChangePreview = this.handleChangePreview.bind(this);
    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
  }
  handleUploadButtonClick() {
    this.fileInput.click();
  }
  handleChangePreview() {
    const file = this.fileInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        imgName: file.name || '',
        imgUrl: reader.result
      });
      this.props.handleImageChange(file, this.state.imgUrl);
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  render() {
    return (
      <div>
        <Button onClick={this.handleUploadButtonClick}>
          <Translate value="common.uploadButton" />
        </Button>
        <div className={this.state.imgUrl ? 'preview' : 'hidden'}>
          <img
            src={this.state.imgUrl}
            ref={(p) => {
              return (this.preview = p);
            }}
            alt="preview"
          />
        </div>
        <div className="preview-title">{this.state.imgName}</div>
        <input
          type="file"
          onChange={this.handleChangePreview}
          className="hidden"
          ref={(p) => {
            return (this.fileInput = p);
          }}
        />
      </div>
    );
  }
}

export default ImageUploader;