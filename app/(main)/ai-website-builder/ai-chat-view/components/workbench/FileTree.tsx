import { Icon } from '@iconify/react';
import { memo, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { FileMap } from '../../lib/stores/files';
import { classNames } from '../../utils/classNames';
import { createScopedLogger, renderLogger } from '../../utils/logger';
import { FileTreeIllustration } from './FileTreeIllustration';

const logger = createScopedLogger('FileTree');

const NODE_PADDING_LEFT = 8;
const DEFAULT_HIDDEN_FILES = [/\/node_modules\//, /\/\.next/, /\/\.astro/];

interface Props {
  files?: FileMap;
  selectedFile?: string;
  onFileSelect?: (filePath: string) => void;
  rootFolder?: string;
  hideRoot?: boolean;
  collapsed?: boolean;
  allowFolderSelection?: boolean;
  hiddenFiles?: Array<string | RegExp>;
  unsavedFiles?: Set<string>;
  className?: string;
}

export const FileTree = memo(
  ({
    files = {},
    onFileSelect,
    selectedFile,
    rootFolder,
    hideRoot = false,
    collapsed = false,
    allowFolderSelection = false,
    hiddenFiles,
    className,
    unsavedFiles,
  }: Props) => {
    renderLogger.trace('FileTree');

    const computedHiddenFiles = useMemo(
      () => [...DEFAULT_HIDDEN_FILES, ...(hiddenFiles ?? [])],
      [hiddenFiles],
    );

    const fileList = useMemo(() => {
      return buildFileList(files, rootFolder, hideRoot, computedHiddenFiles);
    }, [files, rootFolder, hideRoot, computedHiddenFiles]);

    const [collapsedFolders, setCollapsedFolders] = useState(() => {
      return collapsed
        ? new Set(
            fileList
              .filter((item) => item.kind === 'folder')
              .map((item) => item.fullPath),
          )
        : new Set<string>();
    });

    useEffect(() => {
      if (collapsed) {
        setCollapsedFolders(
          new Set(
            fileList
              .filter((item) => item.kind === 'folder')
              .map((item) => item.fullPath),
          ),
        );
        return;
      }

      setCollapsedFolders((prevCollapsed) => {
        const newCollapsed = new Set<string>();

        for (const folder of fileList) {
          if (folder.kind === 'folder' && prevCollapsed.has(folder.fullPath)) {
            newCollapsed.add(folder.fullPath);
          }
        }

        return newCollapsed;
      });
    }, [fileList, collapsed]);

    const filteredFileList = useMemo(() => {
      const list = [];

      let lastDepth = Number.MAX_SAFE_INTEGER;

      for (const fileOrFolder of fileList) {
        const depth = fileOrFolder.depth;

        // if the depth is equal we reached the end of the collaped group
        if (lastDepth === depth) {
          lastDepth = Number.MAX_SAFE_INTEGER;
        }

        // ignore collapsed folders
        if (collapsedFolders.has(fileOrFolder.fullPath)) {
          lastDepth = Math.min(lastDepth, depth);
        }

        // ignore files and folders below the last collapsed folder
        if (lastDepth < depth) {
          continue;
        }

        list.push(fileOrFolder);
      }

      return list;
    }, [fileList, collapsedFolders]);

    const toggleCollapseState = (fullPath: string) => {
      setCollapsedFolders((prevSet) => {
        const newSet = new Set(prevSet);

        if (newSet.has(fullPath)) {
          newSet.delete(fullPath);
        } else {
          newSet.add(fullPath);
        }

        return newSet;
      });
    };

    return (
      <div className={classNames('overflow-y-auto text-sm', className)}>
        {filteredFileList.length === 0 ? (
          <div className="text-text-secondary flex h-full flex-col items-center justify-center p-4 text-center select-none">
            <div className="mb-4 scale-75 opacity-40">
              <FileTreeIllustration />
            </div>
            <p className="text-sm font-medium opacity-60">No files found</p>
          </div>
        ) : (
          filteredFileList.map((fileOrFolder) => {
            switch (fileOrFolder.kind) {
              case 'file': {
                return (
                  <File
                    key={fileOrFolder.id}
                    selected={selectedFile === fileOrFolder.fullPath}
                    file={fileOrFolder}
                    unsavedChanges={unsavedFiles?.has(fileOrFolder.fullPath)}
                    onClick={() => {
                      onFileSelect?.(fileOrFolder.fullPath);
                    }}
                  />
                );
              }
              case 'folder': {
                return (
                  <Folder
                    key={fileOrFolder.id}
                    folder={fileOrFolder}
                    selected={
                      allowFolderSelection &&
                      selectedFile === fileOrFolder.fullPath
                    }
                    collapsed={collapsedFolders.has(fileOrFolder.fullPath)}
                    onClick={() => {
                      toggleCollapseState(fileOrFolder.fullPath);
                    }}
                  />
                );
              }
              default: {
                return undefined;
              }
            }
          })
        )}
      </div>
    );
  },
);

export default FileTree;

interface FolderProps {
  folder: FolderNode;
  collapsed: boolean;
  selected?: boolean;
  onClick: () => void;
}

function Folder({
  folder: { depth, name },
  collapsed,
  selected = false,
  onClick,
}: FolderProps) {
  return (
    <NodeButton
      className={classNames('group', {
        'text-text-secondary hover:text-text hover:bg-surface-c border-transparent bg-transparent':
          !selected,
        '!border-l-[var(--d-admin-primary-color)] bg-[var(--d-admin-surface-d)] font-medium text-[var(--d-admin-primary-color)]':
          selected,
      })}
      depth={depth}
      iconClasses="scale-98"
      onClick={onClick}
    >
      <Icon
        icon={collapsed ? 'ph:caret-right' : 'ph:caret-down'}
        className={classNames('scale-98', {
          'text-text-secondary': !selected,
          'text-primary': selected,
        })}
      />
      {name}
    </NodeButton>
  );
}

interface FileProps {
  file: FileNode;
  selected: boolean;
  unsavedChanges?: boolean;
  onClick: () => void;
}

function File({
  file: { depth, name },
  onClick,
  selected,
  unsavedChanges = false,
}: FileProps) {
  return (
    <NodeButton
      className={classNames('group', {
        'hover:bg-surface-c text-text-secondary border-transparent bg-transparent':
          !selected,
        '!border-l-[var(--d-admin-primary-color)] bg-[var(--d-admin-surface-d)] font-medium text-[var(--d-admin-primary-color)]':
          selected,
      })}
      depth={depth}
      iconClasses={classNames('scale-98', {
        'group-hover:text-text': !selected,
      })}
      onClick={onClick}
    >
      <Icon
        icon="ph:file-duotone"
        className={classNames('scale-98', {
          'text-text-secondary': !selected,
          'text-primary': selected,
        })}
      />
      <div
        className={classNames('flex items-center', {
          'group-hover:text-text': !selected,
        })}
      >
        <div className="flex-1 truncate pr-2">{name}</div>
        {unsavedChanges && (
          <span className="h-2 w-2 shrink-0 scale-68 rounded-full bg-orange-500 text-orange-500" />
        )}
      </div>
    </NodeButton>
  );
}

interface ButtonProps {
  depth: number;
  iconClasses: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function NodeButton({
  depth,
  iconClasses,
  onClick,
  className,
  children,
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'text-faded flex w-full items-center gap-1.5 border-2 border-transparent py-0.5 pr-2',
        className,
      )}
      style={{ paddingLeft: `${6 + depth * NODE_PADDING_LEFT}px` }}
      onClick={() => onClick?.()}
    >
      <div
        className={classNames(
          'flex shrink-0 scale-120 items-center justify-center',
          iconClasses,
        )}
      ></div>
      <div className="flex w-full items-center gap-2 truncate text-left">
        {children}
      </div>
    </button>
  );
}

type Node = FileNode | FolderNode;

interface BaseNode {
  id: number;
  depth: number;
  name: string;
  fullPath: string;
}

interface FileNode extends BaseNode {
  kind: 'file';
}

interface FolderNode extends BaseNode {
  kind: 'folder';
}

function buildFileList(
  files: FileMap,
  rootFolder = '/',
  hideRoot: boolean,
  hiddenFiles: Array<string | RegExp>,
): Node[] {
  const folderPaths = new Set<string>();
  const fileList: Node[] = [];

  let defaultDepth = 0;

  if (rootFolder === '/' && !hideRoot) {
    defaultDepth = 1;
    fileList.push({
      kind: 'folder',
      name: '/',
      depth: 0,
      id: 0,
      fullPath: '/',
    });
  }

  for (const [filePath, dirent] of Object.entries(files)) {
    const segments = filePath.split('/').filter((segment) => segment);
    const fileName = segments.at(-1);

    if (!fileName || isHiddenFile(filePath, fileName, hiddenFiles)) {
      continue;
    }

    let currentPath = '';

    let i = 0;
    let depth = 0;

    while (i < segments.length) {
      const name = segments[i];
      const fullPath = (currentPath += `/${name}`);

      if (
        !fullPath.startsWith(rootFolder) ||
        (hideRoot && fullPath === rootFolder)
      ) {
        i++;
        continue;
      }

      if (i === segments.length - 1 && dirent?.type === 'file') {
        fileList.push({
          kind: 'file',
          id: fileList.length,
          name,
          fullPath,
          depth: depth + defaultDepth,
        });
      } else if (!folderPaths.has(fullPath)) {
        folderPaths.add(fullPath);

        fileList.push({
          kind: 'folder',
          id: fileList.length,
          name,
          fullPath,
          depth: depth + defaultDepth,
        });
      }

      i++;
      depth++;
    }
  }

  return sortFileList(rootFolder, fileList, hideRoot);
}

function isHiddenFile(
  filePath: string,
  fileName: string,
  hiddenFiles: Array<string | RegExp>,
) {
  return hiddenFiles.some((pathOrRegex) => {
    if (typeof pathOrRegex === 'string') {
      return fileName === pathOrRegex;
    }

    return pathOrRegex.test(filePath);
  });
}

/**
 * Sorts the given list of nodes into a tree structure (still a flat list).
 *
 * This function organizes the nodes into a hierarchical structure based on their paths,
 * with folders appearing before files and all items sorted alphabetically within their level.
 *
 * @note This function mutates the given `nodeList` array for performance reasons.
 *
 * @param rootFolder - The path of the root folder to start the sorting from.
 * @param nodeList - The list of nodes to be sorted.
 *
 * @returns A new array of nodes sorted in depth-first order.
 */
function sortFileList(
  rootFolder: string,
  nodeList: Node[],
  hideRoot: boolean,
): Node[] {
  logger.trace('sortFileList');

  const nodeMap = new Map<string, Node>();
  const childrenMap = new Map<string, Node[]>();

  // pre-sort nodes by name and type
  nodeList.sort((a, b) => compareNodes(a, b));

  for (const node of nodeList) {
    nodeMap.set(node.fullPath, node);

    const parentPath = node.fullPath.slice(0, node.fullPath.lastIndexOf('/'));

    if (parentPath !== rootFolder.slice(0, rootFolder.lastIndexOf('/'))) {
      if (!childrenMap.has(parentPath)) {
        childrenMap.set(parentPath, []);
      }

      childrenMap.get(parentPath)?.push(node);
    }
  }

  const sortedList: Node[] = [];

  const depthFirstTraversal = (path: string): void => {
    const node = nodeMap.get(path);

    if (node) {
      sortedList.push(node);
    }

    const children = childrenMap.get(path);

    if (children) {
      for (const child of children) {
        if (child.kind === 'folder') {
          depthFirstTraversal(child.fullPath);
        } else {
          sortedList.push(child);
        }
      }
    }
  };

  if (hideRoot) {
    // if root is hidden, start traversal from its immediate children
    const rootChildren = childrenMap.get(rootFolder) || [];

    for (const child of rootChildren) {
      depthFirstTraversal(child.fullPath);
    }
  } else {
    depthFirstTraversal(rootFolder);
  }

  return sortedList;
}

function compareNodes(a: Node, b: Node): number {
  if (a.kind !== b.kind) {
    return a.kind === 'folder' ? -1 : 1;
  }

  return a.name.localeCompare(b.name, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}
