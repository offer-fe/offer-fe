import { MEDIUM_GRAY } from '@constants'
import styled from '@emotion/styled'
import type { StyledImgProps } from './types'

const StyledImg = styled.img<StyledImgProps>`
  display: ${({ block }): string | undefined => (block ? 'block' : undefined)};
  object-fit: ${({ mode }): string => (mode ? mode : 'cover')};
  width: ${({ width }): string =>
    typeof width === 'string' ? width : `${width}px`};
  height: ${({ height }): string =>
    typeof height === 'string' ? height : `${height}px`};
  border: ${({ border }): string =>
    border ? `1px solid ${MEDIUM_GRAY}` : 'none'};
`
export default StyledImg
