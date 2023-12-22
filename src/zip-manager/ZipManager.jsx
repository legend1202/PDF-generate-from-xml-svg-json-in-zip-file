import "./styles/index.css";
import ReportTemplate from './components/ReportTemplate';

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  filesystemService,
  downloadService,
  i18nService,
  storageService,
  zipService,
  shareTargetService,
  fileHandlersService,
  stylesheetService,
  environmentService,
  keyboardService,
  themeService,
  documentService,
  windowService,
  musicService
} from "./services/index.js";
import {
  constants,
  features,
  getUIState,
  getEventHandlers
} from "./business/index.js";
import {
  Downloads,
  TopButtonBar,
  Entries,
  ResetDialog,
  ErrorMessageDialog,
  ChooseActionDialog
} from "./components/index.jsx";
import { getMessages } from "./messages/index.js";
import { getHooks } from "./hooks/hooks.js";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import MyDocument from "./components/MyDocument";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

const {
  getCommonFeatures,
  getEntriesFeatures,
  getFoldersFeatures,
  getSelectedFolderFeatures,
  getHighlightedEntriesFeatures,
  getFilesystemFeatures,
  getDownloadsFeatures,
  getClipboardFeatures,
  getOptionsFeatures,
  getAppFeatures,
  getMiscFeatures
} = features;
const messages = getMessages({ i18nService });
const apiFilesystem = zipService.createZipFileSystem();
const { root } = apiFilesystem;
const rootZipFilename = messages.ROOT_ZIP_FILENAME;

function ZipManager() {
  const [zipFilesystem, setZipFilesystem] = useState(apiFilesystem);
  const [selectedFolder, setSelectedFolder] = useState(root);
  const [entries, setEntries] = useState([]);
  const [entriesElementHeight, setEntriesElementHeight] = useState(0);
  const [entriesDeltaHeight, setEntriesDeltaHeight] = useState(0);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [navigation, setNavigation] = useState({
    previousHighlight: null,
    direction: 0
  });
  const [downloads, setDownloads] = useState({ queue: [], nextId: 0 });
  const [clipboardData, setClipboardData] = useState(null);
  const [history, setHistory] = useState({
    path: [root],
    index: 0
  });
  const [dialogs, setDialogs] = useState({});
  const [clickedButtonName, setClickedButtonName] = useState(null);
  const [theme, setTheme] = useState({});
  const [musicData, setMusicData] = useState({
    frequencyData: []
  });

  // const [orderId, setOrderId] = useState("");
  // const [quntity, setQuantity] = useState(0);
  const reportTemplateRef = useRef(null);

  const highlightedEntryElementRef = useRef(null);
  const entriesElementRef = useRef(null);
  const entriesHeightRef = useRef(1);
  const playerActiveRef = useRef(false);

  const pdfHtml = useRef(null);

  // const stData = useSelector(state => state.reducer.jsonData);

  const entriesElement = entriesElementRef.current;
  const musicPlayerActive = playerActiveRef.current;

  const getHighlightedEntryElement = () => highlightedEntryElementRef.current;
  const resetHighlightedEntryElement = () =>
    (highlightedEntryElementRef.current = null);
  const getEntriesHeight = () => entriesHeightRef.current;
  const setEntriesHeight = (height) => (entriesHeightRef.current = height);
  const setPlayerActive = (active) => (playerActiveRef.current = active);

  const { abortDownload, removeDownload } = getDownloadsFeatures({
    setDownloads,
    downloadService
  });

  const {
    modifierKeyPressed,
    saveZipFile,
    saveEntries,
    openDisplayError,
    closeDisplayError
  } = getCommonFeatures({
    dialogs,
    setDownloads,
    setDialogs,
    removeDownload,
    downloadService,
    filesystemService,
    environmentService
  });

  const {
    initOptionsFeatures,
    setOptions,
    getOptions,
    openOptions
  } = getOptionsFeatures({
    dialogs,
    setDialogs,
    setTheme,
    zipService,
    storageService,
    stylesheetService,
    environmentService,
    themeService,
    constants
  });

  const {
    disabledExportZip,
    disabledReset,
    disabledNavigation,
    disabledBack,
    disabledForward,
    disabledCopy,
    disabledCut,
    disabledPaste,
    disabledHighlightAll,
    disabledExtract,
    disabledRename,
    disabledDelete,
    disabledEnterEntry,
    dialogDisplayed,
    hiddenDownloadManager,
    hiddenInfobar,
    highlightedEntry,
    highlightedEntries,
    selectedFolderEntries,
  } = getUIState({
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    history,
    getOptions,
    dialogs,
    filesystemService
  });

  const {
    highlight,
    highlightEntries,
    toggle,
    toggleRange,
    updateEntriesHeight,
    updateEntriesElementHeight,
    updateHighlightedEntries,
    registerResizeEntriesHandler,
    onEntriesKeyUp,
    onEntriesKeyDown
  } = getEntriesFeatures({
    disabledNavigation,
    disabledHighlightAll,
    entries,
    selectedFolderEntries,
    highlightedIds,
    navigation,
    dialogDisplayed,
    entriesElementHeight,
    entriesDeltaHeight,
    entriesElement,
    setHighlightedIds,
    resetHighlightedEntryElement,
    setNavigation,
    setOptions,
    setEntriesHeight,
    setEntriesElementHeight,
    setEntriesDeltaHeight,
    setClickedButtonName,
    getEntriesHeight,
    getHighlightedEntryElement,
    getOptions,
    modifierKeyPressed,
    documentService,
    windowService,
    constants
  });

  const {
    goIntoFolder,
    refreshSelectedFolder,
    updateHistoryData,
    onFoldersKeyUp
  } = getFoldersFeatures({
    disabledBack,
    disabledForward,
    history,
    highlightedEntry,
    highlightedEntries,
    selectedFolder,
    setSelectedFolder,
    setEntries,
    setHistory,
    setHighlightedIds,
    setClickedButtonName,
    modifierKeyPressed,
    constants
  });

  const {
    initSelectedFolderFeatures,
    openPromptCreateFolder,
    addFiles,
    dropFiles,
    closeChooseAction,
    importZipFile,
    openPromptExportZip,
    showAddFilesPicker,
    showImportZipFilePicker,
    onSelectedFolderKeyDown
  } = getSelectedFolderFeatures({
    disabledPaste,
    disabledExportZip,
    zipFilesystem,
    selectedFolder,
    rootZipFilename,
    clipboardData,
    dialogs,
    setHighlightedIds,
    setClipboardData,
    setDialogs,
    setClickedButtonName,
    refreshSelectedFolder,
    highlightEntries,
    saveZipFile,
    getOptions,
    openDisplayError,
    filesystemService,
    fileHandlersService,
    shareTargetService,
    modifierKeyPressed,
    constants
  });

  const {
    openPromptExtract,
    onHighlightedEntriesKeyUp,
    onHighlightedEntriesKeyDown
  } = getHighlightedEntriesFeatures({
    disabledCopy,
    disabledCut,
    disabledExtract,
    disabledRename,
    disabledDelete,
    zipFilesystem,
    entries,
    highlightedIds,
    highlightedEntry,
    highlightedEntries,
    navigation,
    dialogs,
    setClipboardData,
    setHighlightedIds,
    setNavigation,
    setDialogs,
    setClickedButtonName,
    refreshSelectedFolder,
    updateHistoryData,
    saveEntries,
    getOptions,
    openDisplayError,
    filesystemService,
    modifierKeyPressed,
    constants
  });

  const { openConfirmReset, reset, closeConfirmReset } = getFilesystemFeatures({
    dialogs,
    setZipFilesystem,
    setDialogs,
    zipService
  });

  const {
    updateAccentColor,
    updateSkin,
    initMiscFeatures
  } = getMiscFeatures({
    theme,
    setOptions,
    setTheme,
    setMusicData,
    setPlayerActive,
    getOptions,
    stylesheetService,
    themeService,
    musicService,
    constants
  });

  const {
    enterEntry,
    initAppFeatures,
    updateZipFilesystem,
    resetClickedButtonName,
    getAppClassName,
    onAppKeyUp
  } = getAppFeatures({
    disabledEnterEntry,
    zipFilesystem,
    highlightedEntry,
    selectedFolder,
    hiddenInfobar,
    hiddenDownloadManager,
    setNavigation,
    setSelectedFolder,
    setHighlightedIds,
    setHistory,
    setClickedButtonName,
    goIntoFolder,
    openPromptExtract,
    refreshSelectedFolder,
    modifierKeyPressed,
    stylesheetService,
    documentService,
    i18nService,
    constants,
    messages
  });

  const { useKeyUp, useKeyDown, usePageUnload } = getHooks({
    keyboardService,
    windowService
  });

  const { handleKeyUp, handleKeyDown, handlePageUnload } = getEventHandlers({
    entries,
    downloads,
    dialogDisplayed,
    onEntriesKeyUp,
    onFoldersKeyUp,
    onHighlightedEntriesKeyUp,
    onAppKeyUp,
    onEntriesKeyDown,
    onHighlightedEntriesKeyDown,
    onSelectedFolderKeyDown
  });

  const appClassName = getAppClassName();

  useKeyUp(handleKeyUp);
  useKeyDown(handleKeyDown);
  usePageUnload(handlePageUnload);

  useEffect(updateZipFilesystem, [zipFilesystem]);
  useEffect(updateHighlightedEntries, [highlightedIds]);
  useEffect(updateAccentColor, [theme.accentColor]);
  useEffect(updateSkin, [theme.skin]);
  useEffect(() => {
    initSelectedFolderFeatures();
    initMiscFeatures();
    initOptionsFeatures();
    initAppFeatures();
  }, []);

  async function addGoogleFontToPDF(pdf, fontName, base64Font) {
    pdf.addFileToVFS(`custom.ttf`, base64Font);
    pdf.addFont(`custom.ttf`, "custom");
  }

  async function getBase64Font(url) {
    const fontFetch = await fetch(url);
    const fontBlob = await fontFetch.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fontBlob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const onDownload = async (orderId, quantity) => {
    // const input = document.getElementById('businessCard');
    // const docWidth = input.offsetWidth;
    // const docHeight = input.offsetHeight;
    // const downloadFilename = "" + quntity + " X " + orderId;

    // const doc = new jsPDF({
    //   orientation: "landscape",
		// 	format: [docWidth+2, docHeight+2],
		// 	unit: 'px',
		// });
    // // Set the font for the entire document
    // doc.text("Hello world with custom font!", 10, 10);
    // doc.save("hahaha");
    // console.log(fontFamily);
    
		// doc.html(input, {
    //   html2canvas: {
    //     scale: 0.45
    //   },
    //   callback: function (doc) {
    //       doc.save();
    //   }
    //   // async callback(doc) {
    //   //   const base64Data = getBase64Font("https://fonts.googleapis.com/css2?family=Chewy:wght@400;700&display=swap");
    //   //   await doc.addFileToVFS('JosefinSans.ttf', font);
    //   //   await doc.addFont('JosefinSans.ttf', 'JosefinSans', 'normal');
    //   //   await doc.setFont("JosefinSans", "normal");
    //   //   await doc.text("Hello world with custom font!", 10, 10);
		// 	// 	await doc.save(downloadFilename);
        
		// 	// },
    // });

      console.log("=============", orderId, quantity);
      const downloadFilename = "" + quantity + " X " + orderId + ".pdf";

      const node = document.querySelector("#businessCard");
      let imagesToLoad = node.getElementsByTagName('img');
      imagesToLoad = Array.from(imagesToLoad);

      const promises = imagesToLoad.map(image => new Promise((resolve, reject) => {
        if (!image.complete) {
          // Add crossOrigin attribute for external images
          image.crossOrigin = "anonymous";
          
          image.onload = resolve;
          image.onerror = reject;
        } else {
          resolve();
        }
      }));

      Promise.all(promises).then(() => {
        html2canvas(node, { useCORS: true, scale: 1.8 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [101, 69]
          });
          pdf.addImage(imgData, 'PNG', 0, 0, 101, 69);
          pdf.save(downloadFilename);
        });
      }).catch(error => {
        console.error("An image failed to load", error);
      });
  }

  return (
    <div className={appClassName}>
      <main role="application">
        <TopButtonBar
          disabledExportZipButton={disabledExportZip}
          disabledResetButton={disabledReset}
          clickedButtonName={clickedButtonName}
          onCreateFolder={openPromptCreateFolder}
          onAddFiles={addFiles}
          onImportZipFile={importZipFile}
          onExportZip={openPromptExportZip}
          onReset={openConfirmReset}
          onOpenOptions={openOptions}
          onShowImportZipFilePicker={showImportZipFilePicker}
          onShowAddFilesPicker={showAddFilesPicker}
          onClickedButton={resetClickedButtonName}
          constants={constants}
          messages={messages}
          onDownload={onDownload}
        />
        <Entries
          entries={entries}
          selectedFolder={selectedFolder}
          highlightedIds={highlightedIds}
          entriesElementHeight={entriesElementHeight}
          deltaEntriesHeight={entriesDeltaHeight}
          hiddenDownloadManager={hiddenDownloadManager}
          onDropFiles={dropFiles}
          onHighlight={highlight}
          onToggle={toggle}
          onToggleRange={toggleRange}
          onEnter={enterEntry}
          onUpdateEntriesHeight={updateEntriesHeight}
          onUpdateEntriesElementHeight={updateEntriesElementHeight}
          onRegisterResizeEntriesHandler={registerResizeEntriesHandler}
          entriesElementRef={entriesElementRef}
          highlightedEntryElementRef={highlightedEntryElementRef}
          i18n={i18nService}
          constants={constants}
          messages={messages}
        />
        <Downloads
          onDownload = {onDownload}
        />
        {/* <div style={{margin:" 0 auto"}}>
          <MyDocument />
        </div> */}
        {/* <PDFDownloadLink document={<MyDocument />} fileName="myfile.pdf">
          {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : <button>Download My PDF</button>
          }
      </PDFDownloadLink> */}
        {/* <div ref={reportTemplateRef}>
          <ReportTemplate />
        </div> */}
      </main>
      <ResetDialog
        data={dialogs.reset}
        onReset={reset}
        onClose={closeConfirmReset}
        messages={messages}
      />
      <ErrorMessageDialog
        data={dialogs.displayError}
        onClose={closeDisplayError}
        messages={messages}
      />
      <ChooseActionDialog
        data={dialogs.chooseAction}
        onImportZipFile={importZipFile}
        onAddFiles={addFiles}
        onClose={closeChooseAction}
        messages={messages}
        onDownload={onDownload}
      />
    </div>
  );
}

export default ZipManager;
