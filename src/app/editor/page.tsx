'use client';

import { useEffect } from 'react';

export default function EditorPage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = editorCSS;
    document.head.appendChild(style);

    const wrapper = document.getElementById('editor-root');
    if (!wrapper) return;
    wrapper.innerHTML = editorHTML;

    const editor = new EditorApp();
    (window as any).__editorInstance = editor;

    return () => {
      style.remove();
    };
  }, []);

  return <div id="editor-root" style={{ height: '100%', display: 'flex', flexDirection: 'column' }} />;
}

/* ── CSS ── */
const editorCSS = `
.editor-body {
  font-family: system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #F1F5F9;
  color: #1E293B;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
}

/* ── Toolbar ── */
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
  z-index: 10;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.editor-toolbar-brand {
  font-size: 18px;
  font-weight: 700;
  color: #4F46E5;
  white-space: nowrap;
  margin-right: 8px;
  user-select: none;
}

.editor-toolbar-filename {
  font-size: 13px;
  color: #64748B;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
}

.editor-spacer { flex: 1; }

.editor-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: #fff;
  color: #1E293B;
  cursor: pointer;
  white-space: nowrap;
  transition: all 150ms ease;
  user-select: none;
  font-family: inherit;
}
.editor-btn:hover { background: #F8FAFC; border-color: #CBD5E1; }
.editor-btn:active { transform: scale(.97); }

.editor-btn-primary { background: #4F46E5; color: #fff; border-color: #4F46E5; }
.editor-btn-primary:hover { background: #4338CA; border-color: #4338CA; }
.editor-btn-primary:disabled { background: #A5B4FC; border-color: #A5B4FC; }

.editor-btn-edit { background: #F59E0B; color: #fff; border-color: #F59E0B; }
.editor-btn-edit:hover { background: #D97706; border-color: #D97706; }
.editor-btn-edit.active { background: #EF4444; border-color: #EF4444; }
.editor-btn-edit.active:hover { background: #DC2626; border-color: #DC2626; }

.editor-btn:disabled { opacity: .45; cursor: not-allowed; pointer-events: none; }

/* ── Main Area ── */
.editor-main {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

/* ── Upload Zone ── */
.editor-upload-zone {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  transition: opacity .3s, visibility .3s;
  z-index: 5;
}
.editor-upload-zone.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.editor-upload-card {
  text-align: center;
  padding: 48px 64px;
  background: #fff;
  border: 2px dashed #E2E8F0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 150ms ease;
}
.editor-upload-card:hover, .editor-upload-card.drag-over {
  border-color: #4F46E5;
  background: #EEF2FF;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1);
}

.editor-upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.editor-upload-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.editor-upload-subtitle {
  font-size: 13px;
  color: #64748B;
}

/* ── Preview Container ── */
.editor-preview-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #E2E8F0;
  transition: box-shadow .3s;
}
.editor-preview-container.edit-mode {
  box-shadow: inset 0 0 0 3px #F59E0B;
}

.editor-preview-iframe {
  flex: 1;
  width: 100%;
  border: none;
  background: #fff;
}

.editor-edit-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 5px 14px;
  background: #F59E0B;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-8px);
  transition: all .25s;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(245,158,11,.4);
}
.editor-edit-badge.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Status Bar ── */
.editor-statusbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 16px;
  background: #fff;
  border-top: 1px solid #E2E8F0;
  font-size: 11px;
  color: #64748B;
  flex-shrink: 0;
  user-select: none;
}

.editor-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22C55E;
  flex-shrink: 0;
}
.editor-status-dot.edit { background: #F59E0B; }

/* ── Toast ── */
.editor-toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-toast {
  padding: 10px 20px;
  background: #1E293B;
  color: #fff;
  font-size: 13px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1);
  animation: etoast-in .3s ease;
  pointer-events: none;
}
.editor-toast.success { background: #059669; }
.editor-toast.error { background: #EF4444; }

.editor-toast.out {
  animation: etoast-out .25s ease forwards;
}

@keyframes etoast-in { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes etoast-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(40px); } }

/* ── Format Bar ── */
.editor-format-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
  flex-shrink: 0;
  flex-wrap: wrap;
  transition: all .25s;
}
.editor-format-bar.hidden { display: none; }

.editor-fmt-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.editor-fmt-divider {
  width: 1px;
  height: 20px;
  background: #E2E8F0;
  margin: 0 4px;
}

.editor-btn-fmt {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 30px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #1E293B;
  cursor: pointer;
  transition: all 150ms ease;
  user-select: none;
  font-family: inherit;
  line-height: 1;
}
.editor-btn-fmt:hover { background: #E2E8F0; }
.editor-btn-fmt:active, .editor-btn-fmt.active { background: #CBD5E1; }

.editor-fmt-bold { font-weight: 700; }
.editor-fmt-italic { font-style: italic; font-family: Georgia, serif; font-size: 16px; }
.editor-fmt-underline { text-decoration: underline; font-size: 15px; }
.editor-fmt-strike { text-decoration: line-through; }

/* Alignment icons */
.editor-align-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  width: 18px;
  height: 16px;
}
.editor-align-icon i {
  display: block;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}
.editor-align-left i:nth-child(1) { width: 75%; }
.editor-align-left i:nth-child(2) { width: 100%; }
.editor-align-left i:nth-child(3) { width: 50%; }
.editor-align-center i { margin: 0 auto; }
.editor-align-center i:nth-child(1) { width: 60%; }
.editor-align-center i:nth-child(2) { width: 100%; }
.editor-align-center i:nth-child(3) { width: 70%; }
.editor-align-right i { margin-left: auto; }
.editor-align-right i:nth-child(1) { width: 75%; margin-right: 0; }
.editor-align-right i:nth-child(2) { width: 100%; margin-right: 0; }
.editor-align-right i:nth-child(3) { width: 50%; margin-right: 0; }

.editor-fmt-select {
  height: 30px;
  padding: 0 8px;
  font-size: 12px;
  font-family: inherit;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  background: #fff;
  color: #1E293B;
  cursor: pointer;
  outline: none;
  max-width: 110px;
}
.editor-fmt-select:focus { border-color: #4F46E5; }

.editor-fmt-color {
  width: 28px;
  height: 28px;
  padding: 2px;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
}
.editor-fmt-color::-webkit-color-swatch-wrapper { padding: 0; }
.editor-fmt-color::-webkit-color-swatch { border: none; border-radius: 3px; }

.editor-fmt-btn-group { display: inline-flex; }
.editor-fmt-btn-group .editor-btn-fmt {
  border-radius: 0;
  border: 1px solid #E2E8F0;
  margin-left: -1px;
}
.editor-fmt-btn-group .editor-btn-fmt:first-child { border-radius: 4px 0 0 4px; margin-left: 0; }
.editor-fmt-btn-group .editor-btn-fmt:last-child { border-radius: 0 4px 4px 0; }

.editor-btn-font-size {
  font-size: 13px;
  font-weight: 700;
  min-width: 28px;
}

.editor-font-size-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 30px;
  font-size: 11px;
  font-weight: 600;
  color: #1E293B;
  background: #fff;
  border-top: 1px solid #E2E8F0;
  border-bottom: 1px solid #E2E8F0;
  user-select: none;
}

.editor-btn-painter {
  width: auto;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 500;
}
.editor-btn-painter.active {
  background: #FEF3C7;
  border-color: #F59E0B;
  color: #92400E;
}

.editor-painter-cursor .editor-preview-iframe {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23F59E0B' d='M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z'/%3E%3C/svg%3E") 0 24, auto;
}

#editor-fileInput { display: none; }

@media (max-width: 640px) {
  .editor-toolbar { padding: 8px 12px; gap: 8px; }
  .editor-toolbar-brand { font-size: 16px; margin-right: 0; }
  .editor-btn { padding: 6px 12px; font-size: 12px; }
  .editor-upload-card { padding: 32px 24px; margin: 16px; }
}
`;

/* ── HTML ── */
const editorHTML = `
<body class="editor-body">

<header class="editor-toolbar">
  <span class="editor-toolbar-brand">&#9881; HTML 可视化编辑器</span>
  <span class="editor-toolbar-filename" id="fileName">未打开文件</span>
  <span class="editor-spacer"></span>
  <button class="editor-btn" id="btnOpen" title="打开 HTML 文件 (Ctrl+O)">&#128194; 打开文件</button>
  <button class="editor-btn" id="btnNew" title="新建空白页面">&#10133; 新建</button>
  <button class="editor-btn editor-btn-edit" id="btnEdit" disabled title="切换编辑模式 (Ctrl+E)">&#9998; 编辑模式</button>
  <button class="editor-btn editor-btn-primary" id="btnDownload" disabled title="下载 HTML 文件 (Ctrl+S)">&#128229; 下载文件</button>
</header>

<div class="editor-format-bar hidden" id="formatBar">
  <div class="editor-fmt-group">
    <button class="editor-btn-fmt editor-fmt-bold" id="fmtBold" title="加粗 (Ctrl+B)">B</button>
    <button class="editor-btn-fmt editor-fmt-italic" id="fmtItalic" title="斜体 (Ctrl+I)">I</button>
    <button class="editor-btn-fmt editor-fmt-underline" id="fmtUnderline" title="下划线 (Ctrl+U)">U</button>
    <button class="editor-btn-fmt editor-fmt-strike" id="fmtStrike" title="删除线">S</button>
  </div>

  <span class="editor-fmt-divider"></span>

  <select class="editor-fmt-select" id="fmtFontName" title="字体">
    <option value="">字体</option>
    <option value="默认字体">默认字体</option>
    <option value="宋体">宋体</option>
    <option value="黑体">黑体</option>
    <option value="微软雅黑">微软雅黑</option>
    <option value="楷体">楷体</option>
    <option value="仿宋">仿宋</option>
    <option value="Arial">Arial</option>
    <option value="Georgia">Georgia</option>
    <option value="Times New Roman">Times New Roman</option>
  </select>

  <div class="editor-fmt-group editor-fmt-btn-group">
    <button class="editor-btn-fmt editor-btn-font-size" id="fmtFontSizeDown" title="缩小字号">A&#8315;</button>
    <span class="editor-font-size-display" id="fontSizeDisplay">12</span>
    <button class="editor-btn-fmt editor-btn-font-size" id="fmtFontSizeUp" title="增大字号">A&#8314;</button>
  </div>

  <span class="editor-fmt-divider"></span>

  <input type="color" class="editor-fmt-color" id="fmtColor" title="文字颜色" value="#1E293B">

  <span class="editor-fmt-divider"></span>

  <button class="editor-btn-fmt editor-btn-painter" id="fmtPainter" title="格式刷：选中源文字后点击采集格式，再选中目标文字自动应用">&#128396; 格式刷</button>

  <span class="editor-fmt-divider"></span>

  <div class="editor-fmt-group editor-fmt-btn-group">
    <button class="editor-btn-fmt" id="fmtAlignLeft" title="左对齐">
      <span class="editor-align-icon editor-align-left"><i></i><i></i><i></i></span>
    </button>
    <button class="editor-btn-fmt" id="fmtAlignCenter" title="居中">
      <span class="editor-align-icon editor-align-center"><i></i><i></i><i></i></span>
    </button>
    <button class="editor-btn-fmt" id="fmtAlignRight" title="右对齐">
      <span class="editor-align-icon editor-align-right"><i></i><i></i><i></i></span>
    </button>
  </div>

  <span class="editor-fmt-divider"></span>

  <button class="editor-btn-fmt" id="fmtUndo" title="撤销 (Ctrl+Z)" style="width:auto;padding:0 8px;">&#8630;</button>
  <button class="editor-btn-fmt" id="fmtRedo" title="重做 (Ctrl+Y)" style="width:auto;padding:0 8px;">&#8631;</button>

  <span class="editor-fmt-divider"></span>

  <button class="editor-btn-fmt" id="fmtUnlink" title="取消链接" style="width:auto;padding:0 10px;font-size:12px;">&#128279; 取消链接</button>
</div>

<div class="editor-main" id="mainArea">
  <div class="editor-upload-zone" id="uploadZone">
    <div class="editor-upload-card" id="uploadCard">
      <span class="editor-upload-icon">&#128196;</span>
      <div class="editor-upload-title">打开 HTML 文件</div>
      <div class="editor-upload-subtitle">点击选择文件，或直接拖拽 HTML 文件到此处</div>
    </div>
  </div>

  <div class="editor-preview-container" id="previewContainer" style="opacity:0;visibility:hidden;pointer-events:none;">
    <iframe class="editor-preview-iframe" id="previewIframe" sandbox="allow-same-origin allow-scripts"></iframe>
    <div class="editor-edit-badge" id="editBadge">&#9998; 编辑模式</div>
  </div>
</div>

<footer class="editor-statusbar">
  <span class="editor-status-dot" id="statusDot"></span>
  <span id="statusText">就绪</span>
  <span style="flex:1"></span>
  <span id="statusHint">Ctrl+O 打开 · Ctrl+E 编辑 · Ctrl+S 下载</span>
</footer>

<div class="editor-toast-container" id="toastContainer"></div>
<input type="file" id="editor-fileInput" accept=".html,.htm">

</body>
`;

/* ── JS ── */
class EditorApp {
  fileHandle: any = null;
  currentFileName = '';
  isEditMode = false;
  iframeReady = false;
  originalContent = '';

  uploadZone!: HTMLElement;
  uploadCard!: HTMLElement;
  previewContainer!: HTMLElement;
  previewIframe!: HTMLIFrameElement;
  editBadge!: HTMLElement;
  fileName!: HTMLElement;
  statusDot!: HTMLElement;
  statusText!: HTMLElement;
  statusHint!: HTMLElement;
  toastContainer!: HTMLElement;
  fileInput!: HTMLInputElement;
  btnOpen!: HTMLButtonElement;
  btnNew!: HTMLButtonElement;
  btnEdit!: HTMLButtonElement;
  btnDownload!: HTMLButtonElement;
  mainArea!: HTMLElement;
  formatBar!: HTMLElement;

  constructor() {
    const g = (id: string) => document.getElementById(id) as HTMLElement;
    this.uploadZone = g('uploadZone');
    this.uploadCard = g('uploadCard');
    this.previewContainer = g('previewContainer');
    this.previewIframe = g('previewIframe') as HTMLIFrameElement;
    this.editBadge = g('editBadge');
    this.fileName = g('fileName');
    this.statusDot = g('statusDot');
    this.statusText = g('statusText');
    this.statusHint = g('statusHint');
    this.toastContainer = g('toastContainer');
    this.fileInput = g('editor-fileInput') as HTMLInputElement;
    this.btnOpen = g('btnOpen') as HTMLButtonElement;
    this.btnNew = g('btnNew') as HTMLButtonElement;
    this.btnEdit = g('btnEdit') as HTMLButtonElement;
    this.btnDownload = g('btnDownload') as HTMLButtonElement;
    this.mainArea = g('mainArea');
    this.formatBar = g('formatBar');
    this.init();
  }

  init() {
    this.btnOpen.addEventListener('click', () => this.openFile());
    this.btnNew.addEventListener('click', () => this.newFile());
    this.btnEdit.addEventListener('click', () => this.toggleEditMode());
    this.btnDownload.addEventListener('click', () => this.downloadCurrentFile());
    this.uploadCard.addEventListener('click', () => this.openFile());
    this.fileInput.addEventListener('change', () => this.handleFileInput());

    document.addEventListener('dragover', (e) => { e.preventDefault(); this.uploadCard.classList.add('drag-over'); });
    document.addEventListener('dragleave', (e) => { if (!e.relatedTarget || e.relatedTarget === document.documentElement) this.uploadCard.classList.remove('drag-over'); });
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadCard.classList.remove('drag-over');
      const file = (e.dataTransfer as DataTransfer).files[0];
      if (file && (file.name.endsWith('.html') || file.name.endsWith('.htm') || file.type === 'text/html')) {
        this.loadFromFile(file);
      }
    });

    this.previewIframe.addEventListener('load', () => {
      this.iframeReady = true;
      if (this.isEditMode) this.applyEditMode();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') { e.preventDefault(); this.openFile(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') { e.preventDefault(); this.toggleEditMode(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); this.downloadCurrentFile(); }
    });

    this.bindFormatBar();
  }

  openFile() { this.fileInput.click(); }

  handleFileInput() {
    const file = this.fileInput.files?.[0];
    if (file) {
      this.fileHandle = null;
      this.loadFromFile(file);
      this.showToast('已打开（编辑后可下载到本地）', 'success');
    }
    this.fileInput.value = '';
  }

  async loadFromFile(file: File) {
    try {
      const text = await file.text();
      this.originalContent = text;
      this.currentFileName = file.name;
      this.fileName.textContent = file.name;
      this.loadContent(text);
      this.setFileLoaded(true);
    } catch (err: any) {
      this.showToast('文件读取失败: ' + err.message, 'error');
    }
  }

  newFile() {
    const template = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>新建页面</title>\n<style>\n  body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.7; }\n  h1 { color: #4F46E5; }\n  .card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 16px 0; box-shadow: 0 1px 3px rgba(0,0,0,.1); }\n</style>\n</head>\n<body>\n  <h1>&#128075; 欢迎使用 HTML 可视化编辑器</h1>\n  <div class="card">\n    <p><strong>三步上手：</strong></p>\n    <p>1. 点击工具栏「编辑模式」，进入所见即所得编辑</p>\n    <p>2. 直接在预览区点击文字，像 PPT 一样修改内容</p>\n    <p>3. 点击「下载文件」保存修改后的 HTML</p>\n  </div>\n  <p>你可以删除这些内容，导入自己的 HTML 文件开始编辑。</p>\n</body>\n</html>';
    this.fileHandle = null;
    this.originalContent = template;
    this.currentFileName = 'untitled.html';
    this.fileName.textContent = 'untitled.html（新建）';
    this.loadContent(template);
    this.setFileLoaded(true);
    if (this.isEditMode) this.toggleEditMode();
    this.showToast('已创建空白页面', 'success');
  }

  loadContent(html: string) {
    if (this.isEditMode) this.toggleEditMode();
    this.iframeReady = false;
    this.previewIframe.srcdoc = html;
  }

  getContent() {
    const doc = this.previewIframe.contentDocument;
    if (!doc) return this.originalContent || '';
    const doctype = doc.doctype;
    let dtStr = '<!DOCTYPE html>';
    if (doctype && doctype.name) {
      dtStr = '<!DOCTYPE ' + doctype.name;
      if (doctype.publicId) dtStr += ' PUBLIC "' + doctype.publicId + '"';
      if (doctype.systemId) dtStr += ' "' + doctype.systemId + '"';
      dtStr += '>';
    }
    return dtStr + '\n' + doc.documentElement.outerHTML;
  }

  toggleEditMode() {
    if (!this.iframeReady) return;
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) this.enableEditMode();
    else this.disableEditMode();
  }

  enableEditMode() {
    const doc = this.previewIframe.contentDocument!;
    doc.designMode = 'on';
    const style = doc.createElement('style');
    style.id = '__editor-hover-style';
    style.textContent = '*:hover { outline: 1px dashed rgba(245,158,11,.55) !important; outline-offset: 1px; } a:hover { outline: 2px dashed rgba(245,158,11,.7) !important; } img:hover { outline: 2px dashed rgba(245,158,11,.7) !important; outline-offset: 2px; }';
    doc.head.appendChild(style);
    this.previewContainer.classList.add('edit-mode');
    this.editBadge.classList.add('visible');
    this.btnEdit.classList.add('active');
    this.btnEdit.innerHTML = '&#10006; 退出编辑';
    this.statusDot.classList.add('edit');
    this.statusText.textContent = '编辑模式 — 点击预览区文字直接修改';
    this.formatBar.classList.remove('hidden');
  }

  disableEditMode() {
    const doc = this.previewIframe.contentDocument!;
    doc.designMode = 'off';
    const style = doc.getElementById('__editor-hover-style');
    if (style) style.remove();
    this.previewContainer.classList.remove('edit-mode');
    this.editBadge.classList.remove('visible');
    this.btnEdit.classList.remove('active');
    this.btnEdit.innerHTML = '&#9998; 编辑模式';
    this.statusDot.classList.remove('edit');
    this.statusText.textContent = '预览模式';
    this.formatBar.classList.add('hidden');
  }

  bindFormatBar() {
    const iframe = this.previewIframe;

    const saveSelection = () => {
      const doc = iframe.contentDocument;
      if (!doc) return null;
      const sel = doc.getSelection();
      if (sel && sel.rangeCount > 0) return { range: sel.getRangeAt(0).cloneRange(), doc };
      return null;
    };

    const exec = (command: string, value?: string) => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.body.focus();
      doc.execCommand(command, false, value);
    };

    let pendingSelection: any = null;
    const formatAction = (command: string, value?: string) => {
      if (pendingSelection) {
        const { doc, range } = pendingSelection;
        const sel = (doc as Document).getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
        pendingSelection = null;
      }
      exec(command, value);
    };

    const bindFormatButton = (id: string, command: string, value?: string) => {
      const btn = document.getElementById(id)!;
      btn.addEventListener('mousedown', (e) => { e.preventDefault(); pendingSelection = saveSelection(); });
      btn.addEventListener('click', (e) => { e.preventDefault(); formatAction(command, value); });
    };

    bindFormatButton('fmtBold', 'bold');
    bindFormatButton('fmtItalic', 'italic');
    bindFormatButton('fmtUnderline', 'underline');
    bindFormatButton('fmtStrike', 'strikeThrough');
    bindFormatButton('fmtAlignLeft', 'justifyLeft');
    bindFormatButton('fmtAlignCenter', 'justifyCenter');
    bindFormatButton('fmtAlignRight', 'justifyRight');
    bindFormatButton('fmtUnlink', 'unlink');
    bindFormatButton('fmtUndo', 'undo');
    bindFormatButton('fmtRedo', 'redo');

    // Font Size +/-
    const SIZE_STEPS = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48, 56, 64, 72];

    const getFontSizePx = () => {
      const doc = iframe.contentDocument;
      if (!doc) return 12;
      const sel = doc.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return 12;
      const range = sel.getRangeAt(0);
      const node = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer as Element : range.commonAncestorContainer.parentElement;
      if (!node) return 12;
      return Math.round(parseFloat(getComputedStyle(node).fontSize));
    };

    const findStepIndex = (px: number) => {
      let best = 0;
      for (let i = 1; i < SIZE_STEPS.length; i++) {
        if (Math.abs(SIZE_STEPS[i] - px) < Math.abs(SIZE_STEPS[best] - px)) best = i;
      }
      return best;
    };

    const applyFontSizePx = (targetPx: number) => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const sel = doc.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      let el: Node = range.commonAncestorContainer;
      if (el.nodeType === 3) el = el.parentElement!;
      let sizeSpan: HTMLElement | null = null;
      if (el) {
        let cur: Element | null = el as Element;
        while (cur && cur !== doc.body) {
          if (cur.tagName === 'SPAN' && (cur as HTMLElement).style.fontSize) { sizeSpan = cur as HTMLElement; break; }
          cur = cur.parentElement;
        }
      }
      if (sizeSpan) {
        sizeSpan.style.fontSize = targetPx + 'px';
        const newRange = doc.createRange();
        newRange.selectNodeContents(sizeSpan);
        sel.removeAllRanges();
        sel.addRange(newRange);
      } else {
        const span = doc.createElement('span');
        span.style.fontSize = targetPx + 'px';
        try { range.surroundContents(span); } catch { const fragment = range.extractContents(); span.appendChild(fragment); range.insertNode(span); }
        const newRange = doc.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
      const display = document.getElementById('fontSizeDisplay');
      if (display) display.textContent = String(targetPx);
    };

    const adjustFontSize = (delta: number) => {
      const curPx = getFontSizePx();
      const newIdx = Math.max(0, Math.min(SIZE_STEPS.length - 1, findStepIndex(curPx) + delta));
      applyFontSizePx(SIZE_STEPS[newIdx]);
    };

    let sizePendingSel: any = null;
    document.getElementById('fmtFontSizeDown')!.addEventListener('mousedown', (e) => { e.preventDefault(); sizePendingSel = saveSelection(); });
    document.getElementById('fmtFontSizeDown')!.addEventListener('click', (e) => { e.preventDefault(); if (sizePendingSel) { const { doc, range } = sizePendingSel; const sel = (doc as Document).getSelection()!; sel.removeAllRanges(); sel.addRange(range); sizePendingSel = null; } adjustFontSize(-1); });
    document.getElementById('fmtFontSizeUp')!.addEventListener('mousedown', (e) => { e.preventDefault(); sizePendingSel = saveSelection(); });
    document.getElementById('fmtFontSizeUp')!.addEventListener('click', (e) => { e.preventDefault(); if (sizePendingSel) { const { doc, range } = sizePendingSel; const sel = (doc as Document).getSelection()!; sel.removeAllRanges(); sel.addRange(range); sizePendingSel = null; } adjustFontSize(1); });

    const updateSizeDisplay = () => {
      const px = getFontSizePx();
      const display = document.getElementById('fontSizeDisplay');
      if (display) display.textContent = String(px);
    };
    iframe.contentDocument?.addEventListener('mouseup', updateSizeDisplay);
    iframe.contentDocument?.addEventListener('keyup', updateSizeDisplay);

    // Format Painter
    let painterStyles: any = null;

    const rgbToHex = (rgb: string) => {
      const m = rgb.match(/[\d.]+/g);
      if (!m) return '#000000';
      return '#' + [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])].map(c => c.toString(16).padStart(2, '0')).join('');
    };

    const collectFormatting = () => {
      const doc = iframe.contentDocument;
      if (!doc) return null;
      const sel = doc.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
      const range = sel.getRangeAt(0);
      const node = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer as Element : range.commonAncestorContainer.parentElement;
      if (!node) return null;
      const s = getComputedStyle(node);
      return {
        fontFamily: s.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
        fontSize: Math.round(parseFloat(s.fontSize)),
        isBold: parseInt(s.fontWeight) >= 600,
        isItalic: s.fontStyle === 'italic',
        isUnderline: s.textDecorationLine.includes('underline'),
        color: rgbToHex(s.color),
      };
    };

    const applyFormatting = (styles: any) => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.body.focus();
      if (styles.isBold) doc.execCommand('bold', false);
      if (styles.isItalic) doc.execCommand('italic', false);
      if (styles.isUnderline) doc.execCommand('underline', false);
      doc.execCommand('fontName', false, styles.fontFamily);
      doc.execCommand('foreColor', false, styles.color);
      applyFontSizePx(styles.fontSize);
    };

    const enterPainterMode = () => {
      const styles = collectFormatting();
      if (!styles) { this.showToast('请先选中一段带格式的文字', ''); return; }
      painterStyles = styles;
      const btn = document.getElementById('fmtPainter')!;
      btn.classList.add('editor-btn-painter', 'active');
      btn.innerHTML = '&#128396; 格式刷 &#10003;';
      this.mainArea.classList.add('editor-painter-cursor');
      this.statusText.textContent = '格式刷：已采集格式，在预览区选中目标文字即可应用（Esc 取消）';
    };

    const exitPainterMode = () => {
      painterStyles = null;
      const btn = document.getElementById('fmtPainter')!;
      btn.classList.remove('editor-btn-painter', 'active');
      btn.innerHTML = '&#128396; 格式刷';
      this.mainArea.classList.remove('editor-painter-cursor');
      this.statusText.textContent = this.isEditMode ? '编辑模式 — 点击预览区文字直接修改' : '预览模式';
    };

    document.getElementById('fmtPainter')!.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (painterStyles) exitPainterMode();
      else enterPainterMode();
    });

    iframe.contentDocument?.addEventListener('mouseup', () => {
      if (!painterStyles) return;
      setTimeout(() => {
        if (!painterStyles) return;
        const doc = iframe.contentDocument;
        if (!doc) return;
        const sel = doc.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
          applyFormatting(painterStyles);
          exitPainterMode();
          updateSizeDisplay();
        }
      }, 50);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && painterStyles) exitPainterMode();
    });

    // Font name select
    let savedSelForFont: any = null;
    const fontNameSelect = document.getElementById('fmtFontName') as HTMLSelectElement;
    fontNameSelect.addEventListener('mousedown', () => { savedSelForFont = saveSelection(); });
    fontNameSelect.addEventListener('change', function () {
      if (this.value && savedSelForFont) {
        const { doc, range } = savedSelForFont;
        const sel = (doc as Document).getSelection()!;
        sel.removeAllRanges(); sel.addRange(range);
        savedSelForFont = null;
        exec('fontName', this.value);
      }
      this.value = '';
    });

    // Color picker
    let savedSelForColor: any = null;
    const colorInput = document.getElementById('fmtColor') as HTMLInputElement;
    colorInput.addEventListener('mousedown', () => { savedSelForColor = saveSelection(); });
    colorInput.addEventListener('input', () => {
      if (savedSelForColor) {
        const { doc, range } = savedSelForColor;
        const sel = (doc as Document).getSelection()!;
        sel.removeAllRanges(); sel.addRange(range);
        savedSelForColor = null;
      }
      exec('foreColor', colorInput.value);
    });
  }

  applyEditMode() {
    if (this.isEditMode) { this.isEditMode = false; this.enableEditMode(); this.isEditMode = true; }
  }

  downloadCurrentFile() {
    if (!this.iframeReady) return;
    this.downloadFile(this.getContent());
  }

  downloadFile(content: string) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.currentFileName || 'untitled.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('已下载: ' + (this.currentFileName || 'untitled.html'), 'success');
    this.statusText.textContent = '已下载';
  }

  setFileLoaded(loaded: boolean) {
    if (loaded) {
      this.uploadZone.classList.add('hidden');
      this.previewContainer.style.opacity = '1';
      this.previewContainer.style.visibility = 'visible';
      this.previewContainer.style.pointerEvents = 'auto';
      this.btnEdit.disabled = false;
      this.btnDownload.disabled = false;
      this.statusText.textContent = '预览模式';
    } else {
      this.uploadZone.classList.remove('hidden');
      this.previewContainer.style.opacity = '0';
      this.previewContainer.style.visibility = 'hidden';
      this.previewContainer.style.pointerEvents = 'none';
      this.btnEdit.disabled = true;
      this.btnDownload.disabled = true;
      this.fileName.textContent = '未打开文件';
      this.statusText.textContent = '就绪';
      this.formatBar.classList.add('hidden');
    }
  }

  showToast(message: string, type = '') {
    const toast = document.createElement('div');
    toast.className = 'editor-toast ' + type;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('out'); toast.addEventListener('animationend', () => toast.remove()); }, 2000);
  }
}
