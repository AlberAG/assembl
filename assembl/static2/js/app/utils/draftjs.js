/*
  Utils related to draft-js library

  @flow
*/
import { type ContentBlock, type ContentState, EditorState, type EntityInstance } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { type List, type Map } from 'immutable';

// from our workspaces
/* eslint-disable import/no-extraneous-dependencies */
import { converters as linkConverters } from 'draft-js-link-plugin';
import { converters as attachmentsConverters } from 'draft-js-attachment-plugin';
/* eslint-enable import/no-extraneous-dependencies */

type Entry = {
  localeCode: string,
  value: string | EditorState
};

const IMAGE_ENTITY = 'IMAGE';
const DOCUMENT_ENTITY = 'DOCUMENT';
const LINK_ENTITY = 'LINK';

export function blockToHTML(block: ContentBlock): { start: string, end: string } | void {
  if (block.type === 'atomic') {
    return { start: '<div class="atomic-block" data-blocktype="atomic">', end: '</div>' };
  }

  return undefined;
}

export function htmlToBlock(nodeName: string, node: HTMLElement, lastList: *, inBlock: string): void | string {
  const isAtomicBlock = nodeName === 'div' && node.dataset.blocktype === 'atomic';
  if (isAtomicBlock || (nodeName === 'img' && inBlock !== 'atomic')) {
    return 'atomic';
  }

  return undefined;
}

const customConvertFromHTML = convertFromHTML({
  htmlToBlock: htmlToBlock,
  htmlToEntity: function (nodeName: string, node: HTMLElement, createEntity: Function): EntityInstance | null {
    if (nodeName === 'a') {
      // $FlowFixMe: if nodeName is 'a', node should be an HTMLAnchorElement
      return linkConverters.htmlToEntity(nodeName, node, createEntity);
    }

    return attachmentsConverters.htmlToEntity(nodeName, node, createEntity);
  }
});

const customConvertToHTML = convertToHTML({
  blockToHTML: blockToHTML,
  entityToHTML: (entity: EntityInstance, originalText: string): string => {
    if (entity.type === DOCUMENT_ENTITY || entity.type === IMAGE_ENTITY) {
      return attachmentsConverters.entityToHTML(entity);
    } else if (entity.type === LINK_ENTITY) {
      return linkConverters.entityToHTML(entity, originalText);
    }

    return originalText;
  }
});

export function convertEntries(converter: Function): Function {
  return function (entries: Array<Entry>): Array<Entry> {
    return entries.map(entry => ({
      ...entry,
      value: converter(entry.value)
    }));
  };
}

export function convertToEditorState(value: string): EditorState {
  if (value) {
    return EditorState.createWithContent(customConvertFromHTML(value));
  }

  return EditorState.createEmpty();
}

export const convertEntriesToEditorState = convertEntries(convertToEditorState);

export const convertContentStateToHTML = (cs: ContentState): string => customConvertToHTML(cs);

export const convertEditorStateToHTML = (es: EditorState): string => convertContentStateToHTML(es.getCurrentContent());

export function convertImmutableEntriesToJS(entries: List<Map<string, any>>): Array<Object> {
  return entries.map(entry => entry.toObject()).toArray();
}

export const convertEntriesToHTML = convertEntries(convertEditorStateToHTML);

export function editorStateIsEmpty(editorState: EditorState): boolean {
  const contentState = editorState.getCurrentContent();
  const containAtomicBlock = blockMap => blockMap.some(b => b.type === 'atomic');
  if (contentState.getPlainText().length === 0 && !containAtomicBlock(contentState.getBlockMap())) {
    return true;
  }

  return false;
}