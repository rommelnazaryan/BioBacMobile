import React, {useMemo} from 'react';
import {
  FlatList,
  type FlatListProps,
  type ListRenderItemInfo,
  type StyleProp,
  type ViewStyle,
  View,
  StyleSheet,
} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type RenderChild<T> = (item: T, index: number) => React.ReactNode;

const EMPTY_DATA: any[] = [];

type BaseProps<T> = Omit<
  FlatListProps<T>,
  'renderItem' | 'data' | 'contentContainerStyle' | 'numColumns'
> & {
  data: ReadonlyArray<T> | null | undefined;
  contentContainerStyle?: StyleProp<ViewStyle>;
  columns?: number;
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  fillEmptySpace?: boolean;
  endSpacing?: number;
  includeSafeAreaBottom?: boolean;
  edgePaddingPercent?: number;
  includeSafeAreaTop?: boolean;
  equalizeTopBottomPadding?: boolean;
  onEndReached?: () => void;
};

type WithRenderItem<T> = BaseProps<T> & {
  renderItem: (info: ListRenderItemInfo<T>) => React.ReactElement | null;
  children?: never;
};

type WithChildren<T> = BaseProps<T> & {
  renderItem?: never;
  children: RenderChild<T>;
};

export type VerticalFlatListProps<T> = WithRenderItem<T> | WithChildren<T>;

export default function VerticalFlatList<T>(props: VerticalFlatListProps<T>) {
  const insets = useSafeAreaInsets();
  const {height: windowHeight} = useWindowDimensions();
  const rawData = (props.data ?? (EMPTY_DATA as T[])) as ReadonlyArray<T>;
  const columns = Math.max(1, Number((props as any).columns ?? 1) || 1);
  const columnGap = Number((props as any).columnGap ?? (props as any).gap ?? 0) || 0;
  const rowGap = Number((props as any).rowGap ?? (props as any).gap ?? 0) || 0;
  const fillEmptySpace = (props as any).fillEmptySpace ?? true;
  const edgePaddingPercent = Number((props as any).edgePaddingPercent ?? 2) || 0;
  const includeSafeAreaTop = (props as any).includeSafeAreaTop ?? false;
  const includeSafeAreaBottom = (props as any).includeSafeAreaBottom ?? false;
  const equalizeTopBottomPadding = (props as any).equalizeTopBottomPadding ?? true;
  const endSpacing = Number((props as any).endSpacing ?? 0) || 0;

  const edgePx = (windowHeight * edgePaddingPercent) / 100;
  const safeTop = includeSafeAreaTop ? insets.top : 0;
  const safeBottom = includeSafeAreaBottom ? insets.bottom : 0;
  const safe = equalizeTopBottomPadding ? Math.max(safeTop, safeBottom) : 0;
  const paddingTop = edgePx + (equalizeTopBottomPadding ? safe : safeTop);
  const paddingBottom = edgePx + (equalizeTopBottomPadding ? safe : safeBottom) + endSpacing;

  const data = useMemo(() => {
    if (!fillEmptySpace || columns <= 1) {
      return rawData as Array<T | null>;
    }
    const len = rawData.length;
    if (len === 0) {
      return [] as Array<T | null>;
    }
    const remainder = len % columns;
    if (remainder === 0) {
      return rawData as Array<T | null>;
    }
    const padCount = columns - remainder;
    return [...rawData, ...Array(padCount).fill(null)] as Array<T | null>;
  }, [rawData, columns, fillEmptySpace]);

  const renderItem = useMemo(() => {
    if ('renderItem' in props && props.renderItem) {
      return props.renderItem;
    }
    const child = (props as WithChildren<T>).children;
    return ({item, index}: ListRenderItemInfo<T>) => child(item, index) as any;
  }, [props]);

  const renderItemWithSpacing = useMemo(() => {
    if (!columnGap && !rowGap) {
      return renderItem;
    }

    return (info: ListRenderItemInfo<any>) => {
      const isEmpty = info.item == null;

      const isEndOfRow = columns <= 1 ? true : (info.index + 1) % columns === 0;
      const spacingStyle: ViewStyle = {
        marginRight: columns > 1 && !isEndOfRow ? columnGap : 0,
        marginBottom: rowGap,
      };

      if (isEmpty) {
        return (
          <View
            pointerEvents="none"
            style={[
              styles.itemWrapper,
              columns > 1 ? styles.gridItem : null,
              spacingStyle,
              styles.emptyCell,
            ]}
          />
        );
      }

      const element = (renderItem as any)(info) as React.ReactElement | null;
      if (!element) {
        return element;
      }

      return (
        <View
          style={[
            styles.itemWrapper,
            columns > 1 ? styles.gridItem : null,
            spacingStyle,
          ]}>
          {element}
        </View>
      );
    };
  }, [columnGap, rowGap, renderItem, columns]);

  const keyExtractor = useMemo(() => {
    const userKeyExtractor = (props as any).keyExtractor as
      | ((item: T, index: number) => string)
      | undefined;
    return (item: T | null, index: number) => {
      if (item == null) {
        return `__empty-${index}`;
      }
      return userKeyExtractor ? userKeyExtractor(item, index) : String(index);
    };
  }, [props]);

  return (
    <FlatList
      {...props}
      data={data as any}
      numColumns={columns}
      key={`columns-${columns}`}
      renderItem={renderItemWithSpacing as any}
      keyExtractor={keyExtractor as any}
      onEndReached={props.onEndReached}
      onEndReachedThreshold={props.onEndReachedThreshold ?? 0.5}
      contentContainerStyle={[
        {paddingTop, paddingBottom},
        props.contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={props.showsVerticalScrollIndicator ?? false}
      keyboardShouldPersistTaps={props.keyboardShouldPersistTaps ?? 'handled'}
    />
  );
}

const styles = StyleSheet.create({
  itemWrapper: {},
  gridItem: {flex: 1},
  emptyCell: {opacity: 0},
});


