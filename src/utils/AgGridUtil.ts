import type { CellKeyDownEvent, GridOptions } from 'ag-grid-community';
import type { CommonResponse } from '~/store/types/CommonResponse';
import moment from 'moment'
import numeral from 'numeral';
import { fetchGet, fetchPost } from './fetchUtils';

const AG_GRID_LOCALE_TR = {
    // Set Filter
    selectAll: '(Tümünü Seç)',
    selectAllSearchResults: '(Tüm Arama Sonuçlarını Seç)',
    addCurrentSelectionToFilter: 'Geçerli seçimi filtreye ekle',
    searchOoo: 'Ara...',
    blanks: '(Boşlar)',
    noMatches: 'Eşleşen sonuç yok',

    // Number Filter & Text Filter
    filterOoo: 'Filtrele...',
    equals: 'Eşittir',
    notEqual: 'Eşit Değil',
    blank: 'Boş',
    notBlank: 'Boş Değil',
    empty: 'Birini Seç',

    // Number Filter
    lessThan: 'Daha Az',
    greaterThan: 'Daha Büyük',
    lessThanOrEqual: 'Küçük Eşit',
    greaterThanOrEqual: 'Büyük Eşit',
    inRange: 'Aralık İçinde',
    inRangeStart: 'başlangıç',
    inRangeEnd: 'bitiş',

    // Text Filter
    contains: 'İçerir',
    notContains: 'İçermez',
    startsWith: 'İle Başlar',
    endsWith: 'İle Biter',

    // Date Filter
    dateFormatOoo: 'yyyy-aa-gg',

    // Filter Conditions
    andCondition: 'VE',
    orCondition: 'VEYA',

    // Filter Buttons
    applyFilter: 'Uygula',
    resetFilter: 'Sıfırla',
    clearFilter: 'Temizle',
    cancelFilter: 'İptal',

    // Filter Titles
    textFilter: 'Metin Filtresi',
    numberFilter: 'Sayı Filtresi',
    dateFilter: 'Tarih Filtresi',
    setFilter: 'Filtre Ayarla',

    // Group Column Filter
    groupFilterSelect: 'Alanı Seç:',

    // Advanced Filter
    advancedFilterContains: 'içerir',
    advancedFilterNotContains: 'içermez',
    advancedFilterTextEquals: 'eşittir',
    advancedFilterTextNotEqual: 'eşit değil',
    advancedFilterStartsWith: 'ile başlar',
    advancedFilterEndsWith: 'ile biter',
    advancedFilterBlank: 'boş',
    advancedFilterNotBlank: 'boş değil',
    advancedFilterEquals: '=',
    advancedFilterNotEqual: '!=',
    advancedFilterGreaterThan: '>',
    advancedFilterGreaterThanOrEqual: '>=',
    advancedFilterLessThan: '<',
    advancedFilterLessThanOrEqual: '<=',
    advancedFilterTrue: 'doğru',
    advancedFilterFalse: 'yanlış',
    advancedFilterAnd: 'VE',
    advancedFilterOr: 'VEYA',
    advancedFilterApply: 'Uygula',
    advancedFilterBuilder: 'Oluşturucu',
    advancedFilterValidationMissingColumn: 'Sütun eksik',
    advancedFilterValidationMissingOption: 'Seçenek eksik',
    advancedFilterValidationMissingValue: 'Değer eksik',
    advancedFilterValidationInvalidColumn: 'Sütun bulunamadı',
    advancedFilterValidationInvalidOption: 'Seçenek bulunamadı',
    advancedFilterValidationMissingQuote: 'Değerin son tırnağı eksik',
    advancedFilterValidationNotANumber: 'Değer bir sayı değil',
    advancedFilterValidationInvalidDate: 'Değer geçerli bir tarih değil',
    advancedFilterValidationMissingCondition: 'Koşul eksik',
    advancedFilterValidationJoinOperatorMismatch: 'Koşuldaki birleştirme operatörleri aynı olmalı',
    advancedFilterValidationInvalidJoinOperator: 'Birleştirme operatörü bulunamadı',
    advancedFilterValidationMissingEndBracket: 'Bitiş parantezi eksik',
    advancedFilterValidationExtraEndBracket: 'Çok fazla bitiş parantezi',
    advancedFilterValidationMessage: 'İfade bir hata içeriyor. ${variable1} - ${variable2}.',
    advancedFilterValidationMessageAtEnd: 'İfade bir hata içeriyor. İfade sonunda ${variable}.',
    advancedFilterBuilderTitle: 'Gelişmiş Filtre',
    advancedFilterBuilderApply: 'Uygula',
    advancedFilterBuilderCancel: 'İptal',
    advancedFilterBuilderAddButtonTooltip: 'Filtre veya Grup Ekle',
    advancedFilterBuilderRemoveButtonTooltip: 'Kaldır',
    advancedFilterBuilderMoveUpButtonTooltip: 'Yukarı Taşı',
    advancedFilterBuilderMoveDownButtonTooltip: 'Aşağı Taşı',
    advancedFilterBuilderAddJoin: 'Grup Ekle',
    advancedFilterBuilderAddCondition: 'Filtre Ekle',
    advancedFilterBuilderSelectColumn: 'Bir sütun seçin',
    advancedFilterBuilderSelectOption: 'Bir seçenek seçin',
    advancedFilterBuilderEnterValue: 'Bir değer girin...',
    advancedFilterBuilderValidationAlreadyApplied: 'Mevcut filtre zaten uygulanmış.',
    advancedFilterBuilderValidationIncomplete: 'Tüm koşullar tamamlanmamış.',
    advancedFilterBuilderValidationSelectColumn: 'Bir sütun seçmelisiniz.',
    advancedFilterBuilderValidationSelectOption: 'Bir seçenek seçmelisiniz.',
    advancedFilterBuilderValidationEnterValue: 'Bir değer girmelisiniz.',

    // Side Bar
    columns: 'Sütunlar',
    filters: 'Filtreler',

    // columns tool panel
    pivotMode: 'Pivot Modu',
    groups: 'Sıra Grupları',
    rowGroupColumnsEmptyMessage: 'Sıra gruplarını ayarlamak için buraya sürükleyin',
    values: 'Değerler',
    valueColumnsEmptyMessage: 'Toplam için buraya sürükleyin',
    pivots: 'Sütun Etiketleri',
    pivotColumnsEmptyMessage: 'Sütun etiketleri için buraya sürükleyin',

    // Header of the Default Group Column
    group: 'Grup',

    // Row Drag
    rowDragRow: 'sıra',
    rowDragRows: 'satırlar',

    // Other
    loadingOoo: 'Yükleniyor...',
    loadingError: 'HATA',
    noRowsToShow: 'Gösterilecek Satır Yok',
    enabled: 'Etkin',

    // Menu
    pinColumn: 'Sütunu Sabitle',
    pinLeft: 'Sola Sabitle',
    pinRight: 'Sağa Sabitle',
    noPin: 'Sabitleme Yok',
    valueAggregation: 'Toplama Değeri',
    noAggregation: 'Yok',
    autosizeThiscolumn: 'Bu Sütunu Otomatik Ayarla',
    autosizeAllColumns: 'Tüm Sütunları Otomatik Ayarla',
    groupBy: 'Grupla',
    ungroupBy: 'Grubu Kaldır',
    ungroupAll: 'Tüm Grupları Kaldır',
    addToValues: '${variable} değerlere ekle',
    removeFromValues: '${variable} değerlerden kaldır',
    addToLabels: '${variable} etiketlere ekle',
    removeFromLabels: '${variable} etiketlerden kaldır',
    resetColumns: 'Sütunları Sıfırla',
    expandAll: 'Tüm Sıra Gruplarını Genişlet',
    collapseAll: 'Tüm Sıra Gruplarını Kapat',
    copy: 'Kopyala',
    ctrlC: 'Ctrl+C',
    ctrlX: 'Ctrl+X',
    copyWithHeaders: 'Başlıklarla Kopyala',
    copyWithGroupHeaders: 'Grup Başlıklarıyla Kopyala',
    cut: 'Kes',
    paste: 'Yapıştır',
    ctrlV: 'Ctrl+V',
    export: 'Dışa Aktar',
    csvExport: 'CSV Dışa Aktar',
    excelExport: 'Excel Dışa Aktar',

    // Enterprise Menu Aggregation and Status Bar
    sum: 'Toplam',
    first: 'İlk',
    last: 'Son',
    min: 'Min',
    max: 'Maks',
    none: 'Yok',
    count: 'Sayım',
    avg: 'Ortalama',
    filteredRows: 'Filtrelenen',
    selectedRows: 'Seçilen',
    totalRows: 'Toplam Satırlar',
    totalAndFilteredRows: 'Satırlar',
    more: 'Daha Fazla',
    to: 'ile',
    of: 'dan',
    page: 'Sayfa',
    pageLastRowUnknown: '?',
    nextPage: 'Sonraki Sayfa',
    lastPage: 'Son Sayfa',
    firstPage: 'İlk Sayfa',
    previousPage: 'Önceki Sayfa',

    // Pivoting
    pivotColumnGroupTotals: 'Toplam',

    // Enterprise Menu (Charts)
    pivotChartAndPivotMode: 'Pivot Grafik & Pivot Modu',
    pivotChart: 'Pivot Grafik',
    chartRange: 'Grafik Aralığı',

    columnChart: 'Sütun',
    groupedColumn: 'Gruplandırmış',
    stackedColumn: 'Yığılmış',
    normalizedColumn: '100% Yığılmış',

    barChart: 'Çubuk',
    groupedBar: 'Gruplandırmış',
    stackedBar: 'Yığılmış',
    normalizedBar: '100% Yığılmış',

    pieChart: 'Pasta',
    pie: 'Pasta',
    doughnut: 'Simit',

    line: 'Çizgi',

    xyChart: 'X Y (Nokta)',
    scatter: 'Nokta',
    bubble: 'Kabarcık',

    areaChart: 'Alan',
    area: 'Alan',
    stackedArea: 'Yığılmış',
    normalizedArea: '100% Yığılmış',

    histogramChart: 'Histogram',
    histogramFrequency: 'Frekans',

    combinationChart: 'Kombine',
    columnLineCombo: 'Sütun & Çizgi',
    AreaColumnCombo: 'Alan & Sütun',

    // Charts
    pivotChartTitle: 'Pivot Grafik',
    rangeChartTitle: 'Aralık Grafik',
    settings: 'Ayarlar',
    data: 'Veri',
    format: 'Biçim',
    categories: 'Kategoriler',
    defaultCategory: '(Hiçbiri)',
    series: 'Seriler',
    xyValues: 'X Y Değerleri',
    paired: 'Eşleşmiş Mod',
    axis: 'Eksen',
    navigator: 'Gezgin',
    color: 'Renk',
    thickness: 'Kalınlık',
    xType: 'X Türü',
    automatic: 'Otomatik',
    category: 'Kategori',
    number: 'Sayı',
    time: 'Zaman',
    autoRotate: 'Otomatik Döndür',
    xRotation: 'X Döndürme',
    yRotation: 'Y Döndürme',
    ticks: 'İşaretler',
    width: 'Genişlik',
    height: 'Yükseklik',
    length: 'Uzunluk',
    padding: 'Dolgu',
    spacing: 'Boşluk',
    chart: 'Grafik',
    title: 'Başlık',
    titlePlaceholder: 'Grafik başlığı - düzenlemek için çift tıklayın',
    background: 'Arkaplan',
    font: 'Yazı Tipi',
    top: 'Üst',
    right: 'Sağ',
    bottom: 'Alt',
    left: 'Sol',
    labels: 'Etiketler',
    size: 'Boyut',
    minSize: 'Minimum Boyut',
    maxSize: 'Maksimum Boyut',
    legend: 'Lejant',
    position: 'Pozisyon',
    markerSize: 'İşaret Boyutu',
    markerStroke: 'İşaret Hat',
    markerPadding: 'İşaret Dolgu',
    itemSpacing: 'Öğe Boşluğu',
    itemPaddingX: 'Öğe Dolgu X',
    itemPaddingY: 'Öğe Dolgu Y',
    layoutHorizontalSpacing: 'Yatay Boşluk',
    layoutVerticalSpacing: 'Dikey Boşluk',
    strokeWidth: 'Çizgi Kalınlığı',
    lineDash: 'Çizgi Tire',
    offset: 'Ofset',
    offsets: 'Ofsetler',
    tooltips: 'İpucular',
    callout: 'Çağrı',
    markers: 'İşaretler',
    shadow: 'Gölge',
    blur: 'Bulanıklık',
    xOffset: 'X Ofset',
    yOffset: 'Y Ofset',
    lineWidth: 'Çizgi Kalınlığı',
    normal: 'Normal',
    bold: 'Kalın',
    italic: 'Eğik',
    boldItalic: 'Kalın Eğik',
    predefined: 'Önceden Tanımlanmış',
    fillOpacity: 'Dolgu Opaklığı',
    strokeOpacity: 'Çizgi Opaklığı',
    histogramBinCount: 'Sütun sayısı',
    columnGroup: 'Sütun',
    barGroup: 'Çubuk',
    pieGroup: 'Pasta',
    lineGroup: 'Çizgi',
    scatterGroup: 'X Y (Nokta)',
    areaGroup: 'Alan',
    histogramGroup: 'Histogram',
    combinationGroup: 'Kombinasyon',
    groupedColumnTooltip: 'Gruplu',
    stackedColumnTooltip: 'Yığılmış',
    normalizedColumnTooltip: '100% Yığılmış',
    groupedBarTooltip: 'Gruplu',
    stackedBarTooltip: 'Yığılmış',
    normalizedBarTooltip: '100% Yığılmış',
    pieTooltip: 'Pasta',
    doughnutTooltip: 'Çörek',
    lineTooltip: 'Çizgi',
    groupedAreaTooltip: 'Alan',
    stackedAreaTooltip: 'Yığılmış',
    normalizedAreaTooltip: '100% Yığılmış',
    scatterTooltip: 'Dağılım',
    bubbleTooltip: 'Kabarcık',
    histogramTooltip: 'Histogram',
    columnLineComboTooltip: 'Sütun ve Çizgi',
    areaColumnComboTooltip: 'Alan ve Sütun',
    customComboTooltip: 'Özel Kombinasyon',
    noDataToChart: 'Çizilmesi için veri yok.',
    pivotChartRequiresPivotMode: 'Pivot Grafik için Pivot Modu etkin olmalıdır.',
    chartSettingsToolbarTooltip: 'Menü',
    chartLinkToolbarTooltip: 'Tabloya Bağlı',
    chartUnlinkToolbarTooltip: 'Tablodan Bağlantı Kesilmiş',
    chartDownloadToolbarTooltip: 'Grafik İndir',
    seriesChartType: 'Seri Grafik Türü',
    seriesType: 'Seri Türü',
    secondaryAxis: 'İkincil Eksen',

    // ARIA
    ariaAdvancedFilterBuilderItem: '${variable1}. Seviye ${variable2}. Düzenlemek için ENTER tuşuna basın.',
    ariaAdvancedFilterBuilderItemValidation: '${variable1}. Seviye ${variable2}. ${variable3} Düzenlemek için ENTER tuşuna basın.',
    ariaAdvancedFilterBuilderList: 'Gelişmiş Filtre Oluşturucu Listesi',
    ariaAdvancedFilterBuilderFilterItem: 'Filtre Koşulu',
    ariaAdvancedFilterBuilderGroupItem: 'Filtre Grubu',
    ariaAdvancedFilterBuilderColumn: 'Sütun',
    ariaAdvancedFilterBuilderOption: 'Seçenek',
    ariaAdvancedFilterBuilderValueP: 'Değer',
    ariaAdvancedFilterBuilderJoinOperator: 'Bağlama Operatörü',
    ariaAdvancedFilterInput: 'Gelişmiş Filtre Girişi',
    ariaChecked: 'seçildi',
    ariaColumn: 'Sütun',
    ariaColumnGroup: 'Sütun Grubu',
    ariaColumnList: 'Sütun Listesi',
    ariaColumnSelectAll: 'Tüm Sütunları Seçmeyi Değiştir',
    ariaDateFilterInput: 'Tarih Filtre Girişi',
    ariaDefaultListName: 'Liste',
    ariaFilterColumnsInput: 'Sütunları Filtrele Girişi',
    ariaFilterFromValue: 'Filtreleme değerinden',
    ariaFilterInput: 'Filtre Girişi',
    ariaFilterList: 'Filtre Listesi',
    ariaFilterToValue: 'Filtreleme değerine',
    ariaFilterValue: 'Filtre Değeri',
    ariaFilterMenuOpen: 'Filtre Menüsünü Aç',
    ariaFilteringOperator: 'Filtreleme Operatörü',
    ariaHidden: 'gizli',
    ariaIndeterminate: 'belirsiz',
    ariaInputEditor: 'Giriş Düzenleyici',
    ariaMenuColumn: 'Sütun menüsünü açmak için CTRL ENTER tuşuna basın.',
    ariaRowDeselect: 'Bu satırın seçimini kaldırmak için SPACE tuşuna basın',
    ariaRowSelectAll: 'Tüm satırları seçmeyi değiştirmek için SPACE tuşuna basın',
    ariaRowToggleSelection: 'Satır seçimini değiştirmek için SPACE tuşuna basın',
    ariaRowSelect: 'Bu satırı seçmek için SPACE tuşuna basın',
    ariaSearch: 'Ara',
    ariaSortableColumn: 'Sıralamak için ENTER tuşuna basın',
    ariaToggleVisibility: 'Görünürlüğü değiştirmek için SPACE tuşuna basın',
    ariaToggleCellValue: 'Hücre değerini değiştirmek için SPACE tuşuna basın',
    ariaUnchecked: 'seçilmemiş',
    ariaVisible: 'görünür',
    ariaSearchFilterValues: 'Filtre değerlerini ara',

    // ARIA Etiketleri için Bırakma Alanları
    ariaRowGroupDropZonePanelLabel: 'Satır Grupları',
    ariaValuesDropZonePanelLabel: 'Değerler',
    ariaPivotDropZonePanelLabel: 'Sütun Etiketleri',
    ariaDropZoneColumnComponentDescription: 'Kaldırmak için DELETE tuşuna basın',
    ariaDropZoneColumnValueItemDescription: 'Yığın türünü değiştirmek için ENTER tuşuna basın',
    ariaDropZoneColumnGroupItemDescription: 'Sıralamak için ENTER tuşuna basın',
    // kullanılan yığın bırakma alanı için, biçim: {toplama}{ariaDropZoneColumnComponentAggFuncSeparator}{sütun adı}
    ariaDropZoneColumnComponentAggFuncSeparator: ' / ',
    ariaDropZoneColumnComponentSortAscending: 'artan',
    ariaDropZoneColumnComponentSortDescending: 'azalan',

    // ARIA Etiketleri için Diyaloglar
    ariaLabelColumnMenu: 'Sütun Menüsü',
    ariaLabelCellEditor: 'Hücre Düzenleyici',
    ariaLabelDialog: 'Diğer Menü',
    ariaLabelSelectField: 'Alan Seç',
    ariaLabelRichSelectField: 'Zengin Alan Seç',
    ariaLabelTooltip: 'İpucu',
    ariaLabelContextMenu: 'Bağlam Menü',
    ariaLabelSubMenu: 'Alt Menü',
    ariaLabelAggregationFunction: 'Toplama Fonksiyonu',
    ariaLabelAdvancedFilterAutocomplete: 'Gelişmiş Filtre Otomatik Tamamlama',
    ariaLabelAdvancedFilterBuilderAddField: 'Gelişmiş Filtre Oluşturucu Alan Ekle',
    ariaLabelAdvancedFilterBuilderColumnSelectField: 'Gelişmiş Filtre Oluşturucu Sütun Seç Alanı',
    ariaLabelAdvancedFilterBuilderOptionSelectField: 'Gelişmiş Filtre Oluşturucu Seçenek Seç Alanı',
    ariaLabelAdvancedFilterBuilderJoinSelectField: 'Gelişmiş Filtre Oluşturucu Birleştirme Operatörü Seç Alanı',

    // Sayı Biçimi (Durum Çubuğu, Sayfalama Paneli)
    thousandSeparator: ',',
    decimalSeparator: '.',

    // Veri tipleri
    true: 'Doğru',
    false: 'Yanlış',
    invalidDate: 'Geçersiz Tarih',
    invalidNumber: 'Geçersiz Sayı',
    january: 'Ocak',
    february: 'Şubat',
    march: 'Mart',
    april: 'Nisan',
    may: 'Mayıs',
    june: 'Haziran',
    july: 'Temmuz',
    august: 'Ağustos',
    september: 'Eylül',
    october: 'Ekim',
    november: 'Kasım',
    december: 'Aralık',
}

/**
 * Returns a color code based on a number between 0 and 50.
 * @param {number} value - The input number.
 * @returns {string} - The corresponding color code.
 */
function getColorCode(value: number, maxVal: number) {
    // Ensure the value is within the valid range
    const clampedValue = Math.max(0, Math.min(maxVal, value));

    // Map the value to a gradient between red and green
    const red = 255 - Math.round((clampedValue / maxVal) * 255);
    const green = Math.round((clampedValue / maxVal) * 255);

    // Convert RGB values to a hex color code
    const colorCode = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}00`;

    return colorCode;
}

export default class AgGridUtils {
    static getLocale(locale: string = "tr") {
        return AG_GRID_LOCALE_TR;
    }


    static getPercentageColoredCellStyle(params: any, maxVal: number = 50) {


        if (typeof params.value !== "undefined" && params.value !== null && !isNaN(params.value)) {
            return { "background-color": getColorCode(params.value, maxVal) }
        }

        return {}
    }

    static getDateValueFormatter(params: any, format: string = "DD/MM/YYYY") {
        return moment(params.value).format(format)
    }

    static getNumberValueFormatter(params: any, format: string = "0,0.000") {
        return numeral(params.value).format(format)
    }

    static getNumberValueFormatterByValue(value: number, format: string = "0,0.000") {
        return numeral(value).format(format)
    }

    static getIntegerValueFormatter(params: any, format: string = "0,0") {
        return numeral(params.value).format(format)
    }

    static getDefaultGridOptions(gridOptions: GridOptions, preferenceName: string): GridOptions {

        const defaultOptions: GridOptions = {
            enableRangeSelection: true,
            rowHeight: 25,
            localeText: AgGridUtils.getLocale(),
            async onColumnMoved(params) {
                if (params.finished) {

                    await fetchPost("/api/v1/auth/user/set-preference", {
                        method: "POST"
                    },
                        {
                            name: preferenceName,
                            information: JSON.stringify(params.columnApi.getColumnState())
                        }
                    )


                }
            },
            async onColumnPinned(params) {
               await fetchPost("/api/v1/auth/user/set-preference", {
                    method: "POST"
                },
                    {
                        name: preferenceName,
                        information: JSON.stringify(params.columnApi.getColumnState())
                    }
                )
            },
            // onCellKeyDown(event) {
            //     const _event = event as CellKeyDownEvent;

            //     if(_event.colDef.editable){
            //         if((event.event as KeyboardEvent).key === "Delete"){
            //             _event.data[_event.colDef.field] = 0;
            //             _event.api.applyTransaction({update:[_event.data]})
            //             _event.api.redoCellEditing();
            //         }
            //     }
            // },
            async onColumnResized(params) {
                if (params.finished) {
                    await fetchPost("/api/v1/auth/user/set-preference", {
                        method: "POST"
                    },
                        {
                            name: preferenceName,
                            information: JSON.stringify(params.columnApi.getColumnState())
                        }
                    )
                }
            }
        }

        const newOptions = Object.assign({}, defaultOptions, gridOptions);

        newOptions.defaultColDef = Object.assign({}, {
            resizable: true,
            floatingFilter: true,
            filter: "agTextColumnFilter",
            sortable: true,
            // suppressKeyboardEvent: (params:any) => {
            //     console.log('cell is editing: ' + params.editing);
            //     console.log('keyboard event:', params.event);

            //     // return true (to suppress) if editing and user hit up/down keys
            //     const key = params.event.key;

            //     return false;
            // }
        }, (gridOptions.defaultColDef ?? {}));

        return newOptions;
    }


    static async applyColumnState(gridOptions: GridOptions, preferenceName: string) {
        const response = await fetchGet(`/api/v1/auth/user/get-preference?name=${preferenceName}`)
        console.log(response)
      

            if (response != null) gridOptions.columnApi?.applyColumnState({ state: response, applyOrder: true });

        
    }


    static getBoldItalicNonZeroStyledCell(params: any) {
        if (!params.node.isRowPinned() && params.value > 0) return { "font-weight": "bold", "font-style": "italic" }
    }

    static getFilledCellStyle(params: any) {
        if (!params.node.isRowPinned() && params.value && parseFloat(params.value) > 0) {
            return { "font-weight": "bold", "background-color": "#feffe8" }
        } else {
            return {}
        }
    }

}

