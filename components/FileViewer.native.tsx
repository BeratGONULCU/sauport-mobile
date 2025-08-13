import React from 'react';
import { View, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { Video, ResizeMode } from 'expo-av';

type Props = { fileUrl?: string; fileType?: string };

export default function FileViewer({ fileUrl, fileType }: Props) {
  if (!fileUrl) return <Text>Dosya bulunamadı</Text>;

  if ((fileType ?? '').toLowerCase() === 'pdf') {
    return (
      <View style={{ height: 500 }}>
        <Pdf source={{ uri: fileUrl }} style={{ flex: 1 }} />
      </View>
    );
  }

  if ((fileType ?? '').toLowerCase() === 'mp4') {
    return (
      <Video
        source={{ uri: fileUrl }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={{ width: '100%', height: 220 }}
      />
    );
  }

  return <Text>Bu dosya tipi desteklenmiyor: {fileType}</Text>;
}
