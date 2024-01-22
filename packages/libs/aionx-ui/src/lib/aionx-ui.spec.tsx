import { render } from '@testing-library/react';

import AionxUi from './aionx-ui';

describe('AionxUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AionxUi />);
    expect(baseElement).toBeTruthy();
  });
});
