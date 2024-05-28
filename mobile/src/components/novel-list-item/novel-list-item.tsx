import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { flatten } from "ramda";
import { NovelListItemProps } from "./novel-list-item.props";
import { stylePresets } from "./novel-list-item.presets";

import { Text, Image, TouchableOpacity } from "react-native";
import { Column } from "../column/column";

import { NovelDetailScreenName } from "../../screens/novel-detail/novel-detail-screen";

import { navigate } from "../../navigators/navigation-utilities";

export const NovelListItem = observer(function NovelListItem(
  props: NovelListItemProps
) {
  const { preset = "default", style: styleOverride, item: novel } = props;

  const containerStyles = flatten([
    stylePresets[preset].CONTAINER,
    styleOverride,
  ]);
  const imageStyles = flatten([stylePresets[preset].IMAGE]);
  const textContainerStyles = flatten([stylePresets[preset].TEXT_CONTAINER]);
  const textStyles = flatten([stylePresets[preset].TEXT]);

  const handlePress = () => {
    navigate(NovelDetailScreenName as never, {
      header: novel.title,
      data: {
        source: novel,
      },
    });
  };

  return (
    <TouchableOpacity style={containerStyles} onPress={handlePress}>
      <Image
        source={{ uri: novel.thumbnail }}
        style={imageStyles}
        resizeMode="contain"
      />
      <Column style={textContainerStyles}>
        <Text style={textStyles}>{novel.title}</Text>
      </Column>
    </TouchableOpacity>
  );
});
