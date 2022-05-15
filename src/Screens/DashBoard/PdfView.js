import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import PDFView from 'react-native-pdf-view';

const PdfView = () => {
    let docUrl = "http://docs.google.com/gview?embedded=true&url="
        (
            <PDFView ref={(pdf) => { this.pdfView = pdf; }}
                src={docUrl}
                onLoadComplete={(pageCount) => {
                    this.pdfView.setNativeProps({
                        zoom: 1.5
                    });
                }}
                style={styles.pdf} />
        )

}

export default PdfView
var styles = StyleSheet.create({
    pdf: {
        flex: 1
    }
});