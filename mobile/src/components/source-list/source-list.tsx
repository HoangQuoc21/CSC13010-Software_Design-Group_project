import * as React from "react";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { flatten } from "ramda";
import { SourceListProps } from "./source-list.props";
import { stylePresets } from "./source-list.presets";
import {
  FlatList,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { Column } from "../column/column";
import { Row } from "../row/row";
import { SourceListItem } from "../source-list-item/source-list-item";
import { translate } from "../../i18n";

// Import the models
import Source from "../../models/sources/source";
import SourceOne from "../../models/sources/source-one";
import { color, radius, spacing, typography, iconSize } from "../../theme";
import { VectorIcon } from "../vector-icon/vector-icon";

export const SourceList = observer(function SourceList(props: SourceListProps) {
  const { preset = "default", style: styleOverride, ...rest } = props;

  const containerStyles = flatten([
    stylePresets[preset].CONTAINER,
    styleOverride,
  ]);
  const searchBarContainerStyles = flatten([
    stylePresets[preset].SEARCH_BAR_CONTAINER,
  ]);
  const searchBarStyles = flatten([stylePresets[preset].SEARCH_BAR]);
  const searchBarItemStyles = flatten([stylePresets[preset].SEARCH_BAR_ITEM]);
  const searchBarItemTextStyles = flatten([
    stylePresets[preset].SEARCH_BAR_ITEM_TEXT,
  ]);

  const listContainerStyles = flatten([stylePresets[preset].LIST_CONTAINER]);
  const titleContainerStyles = flatten([stylePresets[preset].TITLECONTAINER]);
  const titleStyles = flatten([stylePresets[preset].TITLE]);
  const emptyContainerStyles = flatten([stylePresets[preset].EMPTY_CONTAINER]);
  const emptyTextStyles = flatten([stylePresets[preset].EMPTY_TEXT]);
  const loadingContainerStyles = flatten([
    stylePresets[preset].LOADING_CONTAINER,
  ]);
  const loadingStyles = flatten([stylePresets[preset].LOADING]);

  const [sourceList, setSourceList] = useState<Source[]>();
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(false);

  const sourceOne = new SourceOne();

  const [isSearch, setIsSearch] = useState(false);

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(sourceList);

  const fetchSourceList = async () => {
    setLoading(true);

    // Reading the source list from the local storage (implement later)

    // For now, we are just returning the hardcode source list
    const sourceList = [sourceOne, sourceOne];
    return sourceList;
  };

  useEffect(() => {
    fetchSourceList().then((sourceList) => {
      setSourceList(sourceList);
      if (sourceList.length === 0) {
        setIsEmpty(true);
      }
      setLoading(false);
    });
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    setIsSearch(true);
    if (text) {
      const newData = sourceList.filter((item) => {
        const itemData = item.sourceTitle.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setIsSearch(false);
      setFilteredData(sourceList);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setFilteredData(sourceList);
    setIsSearch(false);
  };

  const renderHeader = () => {
    return (
      <Row style={searchBarContainerStyles}>
        <Column style={{ flex: 9 }}>
          <TextInput
            style={searchBarStyles}
            placeholder="Search"
            value={search}
            onChangeText={(text) => handleSearch(text)}
          />
        </Column>
        <Column style={{ flex: 1 }}>
          {isSearch ? (
            <>
              <TouchableOpacity onPress={clearSearch}>
                <VectorIcon
                  name={"close-outline"}
                  color={color.ligthTheme.accent}
                  size={iconSize.iconSearchBar}
                  //alignContent={"center"}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <VectorIcon
                name={"search-outline"}
                color={color.ligthTheme.accent}
                size={iconSize.iconSearchBar}
                //alignContent={"center"}
              />
            </>
          )}
        </Column>
      </Row>
    );
  };

  const renderEmpty = () => {
    return (
      <Column style={emptyContainerStyles}>
        <Text style={emptyTextStyles}>{translate("sourceList.empty")}</Text>
      </Column>
    );
  };

  const renderTitle = () => {
    return (
      <Row style={titleContainerStyles}>
        <Column
          style={{
            flex: 4,
            borderColor: color.ligthTheme.fourth,
            borderBottomWidth: 1,
          }}
        >
          <Text style={titleStyles}>{translate("sourceList.title")}</Text>
        </Column>
        <Column style={{ flex: 6 }} />
      </Row>
    );
  };

  const renderItem = (item: Source) => {
    return <SourceListItem item={item} />;
  };

  const renderSourceList = (sources) => {
    return (
      <FlatList
        data={sources}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
      />
    );
  };

  const renderBody = () => {
    return (
      <Column style={listContainerStyles}>
        {isSearch ? (
          <>{renderSourceList(filteredData)}</>
        ) : (
          <>
            {renderTitle()}
            {isEmpty ? renderEmpty() : renderSourceList(sourceList)}
          </>
        )}
      </Column>
    );
  };

  const LoadingCircle = () => {
    return (
      <View style={loadingContainerStyles}>
        <ActivityIndicator size="large" color={color.common.blue} />
      </View>
    );
  };

  return (
    <Column style={containerStyles}>
      {renderHeader()}
      {renderBody()}
      {loading && <LoadingCircle />}
    </Column>
  );
});
