// @flow
import React from 'react';
import { Translate } from 'react-redux-i18n';
import { Button, OverlayTrigger } from 'react-bootstrap';
import { deleteThematicImageTooltip } from '../common/tooltips';

type FileUploaderProps = {
  filename: string,
  fileOrUrl: File | string,
  mimeType: string,
  name: string,
  handleChange: Function,
  withPreview: boolean,
  isAdminUploader: boolean,
  imgTitle?: string,
  onDeleteClick: Function
};

type FileUploaderState = {
  fileName: string,
  fileSrc?: string | ArrayBuffer
};

/*
  File uploader

  when this component receives an url and that we want to render the preview of this image,
  we need to give it a mimeType prop that starts with 'image/'
*/
class FileUploader extends React.Component<Object, FileUploaderProps, FileUploaderState> {
  props: FileUploaderProps;

  state: FileUploaderState;

  fileInput: HTMLInputElement;

  preview: HTMLImageElement;

  static defaultProps = {
    filename: '',
    mimeType: '',
    name: 'file-uploader',
    withPreview: true,
    isAdminUploader: false,
    imgTitle: null
  };

  constructor(props: FileUploaderProps) {
    super(props);
    this.state = {
      fileName: props.filename,
      fileSrc: undefined
    };
  }

  componentDidMount() {
    this.updateInfo(this.props);
  }

  componentWillReceiveProps(nextProps: FileUploaderProps) {
    if (this.props.fileOrUrl !== nextProps.fileOrUrl) {
      this.updateInfo(nextProps);
    }
  }

  handleUploadButtonClick = () => {
    this.fileInput.click();
  };

  handleChangePreview = () => {
    const file = this.fileInput.files[0];
    if (file) {
      this.setState({
        fileName: file.name || ''
      });
      this.props.handleChange(file);
    }
  };

  updateInfo = ({ filename, fileOrUrl }: FileUploaderProps) => {
    // warning: here fileOrUrl can be an url or a File object
    // update file src and name if fileOrUrl is a File
    if (fileOrUrl && fileOrUrl instanceof File) {
      const file = fileOrUrl;
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          this.setState({
            fileName: file.name || filename,
            fileSrc: reader.result
          });
        },
        false
      );
      if (file) {
        reader.readAsDataURL(fileOrUrl);
      }
    } else if (typeof fileOrUrl === 'string') {
      this.setState({ fileName: filename, fileSrc: fileOrUrl });
    }
  };

  render() {
    const { mimeType, name, withPreview, imgTitle, isAdminUploader, onDeleteClick } = this.props;
    const { fileName } = this.state;
    const fileSrc = this.state.fileSrc;
    const fileIsImage =
      fileSrc && (typeof fileSrc === 'string' || fileSrc instanceof String) && fileSrc.startsWith('data:image/');
    const mimeTypeIsImage = mimeType.startsWith('image/');
    const isToDelete = fileSrc === 'TO_DELETE';
    const isImage = fileIsImage || (mimeTypeIsImage && !isToDelete);
    return (
      <div>
        <Button onClick={this.handleUploadButtonClick}>
          <Translate value="common.uploadButton" />
        </Button>
        {withPreview && isImage && isAdminUploader ? (
          <div className={fileSrc ? 'preview' : 'hidden'}>
            <img
              src={fileSrc}
              ref={(p) => {
                this.preview = p;
              }}
              alt="preview"
            />
            <div className="preview-title">
              <span className="assembl-icon-text-attachment" />
              {imgTitle}
            </div>
            <OverlayTrigger placement="top" overlay={deleteThematicImageTooltip}>
              <Button onClick={onDeleteClick} className="admin-icons">
                <span className="assembl-icon-delete grey" />
              </Button>
            </OverlayTrigger>
          </div>
        ) : (
          <div className={fileSrc && isImage ? 'preview' : 'hidden'}>
            <img
              src={fileSrc}
              ref={(p) => {
                this.preview = p;
              }}
              alt="preview"
            />
          </div>
        )}
        {!isImage && <div className="preview-title">{fileName}</div>}
        <input
          name={name}
          type="file"
          onChange={this.handleChangePreview}
          className="hidden"
          ref={(p) => {
            this.fileInput = p;
          }}
        />
      </div>
    );
  }
}

export default FileUploader;