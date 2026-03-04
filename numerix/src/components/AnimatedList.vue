<template>
  <div ref="containerRef" class="animated-list-container" :class="className">
    <div
      ref="listRef"
      class="animated-list-scroll"
      :class="{ 'scrollbar-visible': displayScrollbar, 'scrollbar-hide': !displayScrollbar }"
      @scroll="handleScroll"
    >
      <Motion
        v-for="(item, index) in items"
        :key="index"
        tag="div"
        :data-index="index"
        class="animated-item-wrapper"
        :initial="{ scale: 0.7, opacity: 0 }"
        :animate="getItemInView(index) ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }"
        :transition="{ duration: 0.2, delay: 0.1 }"
        @mouseenter="() => setSelectedIndex(index)"
        @click="
          () => {
            setSelectedIndex(index);
            emit('itemSelected', item, index);
          }
        "
      >
        <div 
          class="animated-item-content" 
          :class="[{ 'selected': selectedIndex === index }, itemClassName]"
        >
          <slot :item="item" :index="index">
            <p class="item-text">{{ typeof item === 'string' ? item : item.label }}</p>
          </slot>
        </div>
      </Motion>
    </div>
    <div
      v-if="showGradients"
      class="gradient-overlay top-gradient"
      :style="{ opacity: topGradientOpacity }"
    />
    <div
      v-if="showGradients"
      class="gradient-overlay bottom-gradient"
      :style="{ opacity: bottomGradientOpacity }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef } from 'vue';
import { Motion } from 'motion-v';

interface AnimatedListProps {
  items?: any[];
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const props = withDefaults(defineProps<AnimatedListProps>(), {
  items: () => [],
  showGradients: true,
  enableArrowNavigation: true,
  className: '',
  itemClassName: '',
  displayScrollbar: true,
  initialSelectedIndex: -1
});

const emit = defineEmits<{
  itemSelected: [item: any, index: number];
}>();

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const listRef = useTemplateRef<HTMLDivElement>('listRef');
const selectedIndex = ref(props.initialSelectedIndex);
const keyboardNav = ref(false);
const topGradientOpacity = ref(0);
const bottomGradientOpacity = ref(1);
const itemsInView = ref<boolean[]>([]);

const setSelectedIndex = (index: number) => {
  selectedIndex.value = index;
};

const getItemInView = (index: number) => {
  return itemsInView.value[index] ?? false;
};

const handleScroll = (e: Event) => {
  const target = e.target as HTMLDivElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  topGradientOpacity.value = Math.min(scrollTop / 50, 1);
  const bottomDistance = scrollHeight - (scrollTop + clientHeight);
  bottomGradientOpacity.value = scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1);

  updateItemsInView();
};

const updateItemsInView = () => {
  if (!listRef.value) return;

  const container = listRef.value;
  const containerRect = container.getBoundingClientRect();

  itemsInView.value = props.items.map((_, index) => {
    const item = container.querySelector(`[data-index="${index}"]`) as HTMLElement;
    if (!item) return false;

    const itemRect = item.getBoundingClientRect();
    const viewHeight = containerRect.height;
    const itemTop = itemRect.top - containerRect.top;
    const itemBottom = itemTop + itemRect.height;

    return itemTop < viewHeight && itemBottom > 0;
  });
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
    e.preventDefault();
    keyboardNav.value = true;
    setSelectedIndex(Math.min(selectedIndex.value + 1, props.items.length - 1));
  } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
    e.preventDefault();
    keyboardNav.value = true;
    setSelectedIndex(Math.max(selectedIndex.value - 1, 0));
  } else if (e.key === 'Enter') {
    if (selectedIndex.value >= 0 && selectedIndex.value < props.items.length) {
      e.preventDefault();
      emit('itemSelected', props.items[selectedIndex.value], selectedIndex.value);
    }
  }
};

watch([selectedIndex, keyboardNav], () => {
  if (!keyboardNav.value || selectedIndex.value < 0 || !listRef.value) return;
  const container = listRef.value;
  const selectedItem = container.querySelector(`[data-index="${selectedIndex.value}"]`) as HTMLElement | null;
  if (selectedItem) {
    const extraMargin = 50;
    const containerScrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const itemTop = selectedItem.offsetTop;
    const itemBottom = itemTop + selectedItem.offsetHeight;
    if (itemTop < containerScrollTop + extraMargin) {
      container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
    } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
      container.scrollTo({
        top: itemBottom - containerHeight + extraMargin,
        behavior: 'smooth'
      });
    }
  }
  keyboardNav.value = false;
});

onMounted(() => {
  if (props.enableArrowNavigation) {
    window.addEventListener('keydown', handleKeyDown);
  }

  itemsInView.value = new Array(props.items.length).fill(true);
  setTimeout(updateItemsInView, 100);
});

onUnmounted(() => {
  if (props.enableArrowNavigation) {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<style scoped>
.animated-list-container {
  position: relative;
  width: 100%;
}

.animated-list-scroll {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-visible {
  scrollbar-width: thin;
  scrollbar-color: #222 #0b0b0b;
}

.scrollbar-visible::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-visible::-webkit-scrollbar-track {
  background: #0b0b0b;
}

.scrollbar-visible::-webkit-scrollbar-thumb {
  background: #222;
  border-radius: 4px;
}

.animated-item-wrapper {
  margin-bottom: 1rem;
  cursor: pointer;
}

.animated-item-content {
  padding: 1rem;
  background: #111;
  border-radius: 8px;
  transition: background 0.2s;
}

.animated-item-content.selected {
  background: #222;
}

.item-text {
  color: white;
  margin: 0;
}

.gradient-overlay {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.top-gradient {
  top: 0;
  height: 50px;
  background: linear-gradient(to bottom, #0b0b0b, transparent);
}

.bottom-gradient {
  bottom: 0;
  height: 100px;
  background: linear-gradient(to top, #0b0b0b, transparent);
}
</style>
