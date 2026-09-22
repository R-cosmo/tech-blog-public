import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PostList } from './PostList';

const mockPosts = [
  {
    id: 1,
    urlId: 'first-post',
    title: 'First Post',
    category: 'Tech',
    description: 'First article',
    content: 'Content 1',
    imageUrl: 'https://example.com/1.jpg',
    tags: 'tech,blog',
    date: new Date('2024-01-10'),
    views: 12,
    active: true,
  },
  {
    id: 2,
    urlId: 'second-post',
    title: 'Second Post',
    category: 'News',
    description: 'Second article',
    content: 'Content 2',
    imageUrl: 'https://example.com/2.jpg',
    tags: 'news,updates',
    date: new Date('2024-02-10'),
    views: 24,
    active: false,
  },
];

describe('PostList admin workflow', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input);

        if (url === '/api/posts') {
          return {
            ok: true,
            json: async () => mockPosts,
          } as Response;
        }

        if (url === '/api/posts/1/toggle') {
          return {
            ok: true,
            json: async () => ({ ...mockPosts[0], active: false }),
          } as Response;
        }

        if (url === '/api/posts/2/toggle') {
          return {
            ok: true,
            json: async () => ({ ...mockPosts[1], active: true }),
          } as Response;
        }

        if (url === '/api/posts/1') {
          return {
            ok: true,
            json: async () => ({ ok: true }),
          } as Response;
        }

        if (url === '/api/posts/2') {
          return {
            ok: true,
            json: async () => ({ ok: true }),
          } as Response;
        }

        return {
          ok: false,
          json: async () => ({ error: 'Unknown route' }),
        } as Response;
      }),
    );

    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
  });

  it('toggles a published post to draft', async () => {
    render(<PostList />);

    await waitFor(() => expect(screen.getByText('First Post')).toBeInTheDocument());

    const firstPostCard = screen.getByText('First Post').closest('article');
    expect(firstPostCard).not.toBeNull();

    await userEvent.click(within(firstPostCard as HTMLElement).getByRole('button', { name: /Published/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/posts/1/toggle', { method: 'PATCH' });
    });
  });

  it('publishes all selected posts using bulk actions', async () => {
    render(<PostList />);

    await waitFor(() => expect(screen.getByText('Second Post')).toBeInTheDocument());

    await userEvent.click(screen.getByLabelText('Select First Post'));
    await userEvent.click(screen.getByLabelText('Select Second Post'));
    await userEvent.click(screen.getByRole('button', { name: /Publish selected/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/posts/1/toggle', { method: 'PATCH' });
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/posts/2/toggle', { method: 'PATCH' });
    });
  });

  it('deletes a post after confirmation', async () => {
    render(<PostList />);

    await waitFor(() => expect(screen.getByText('First Post')).toBeInTheDocument());

    const firstPostCard = screen.getByText('First Post').closest('article');
    expect(firstPostCard).not.toBeNull();

    await userEvent.click(within(firstPostCard as HTMLElement).getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/posts/1', { method: 'DELETE' });
    });
  });

  it('exports the visible posts as a CSV file', async () => {
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:posts');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    render(<PostList />);

    await waitFor(() => expect(screen.getByText('First Post')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: 'Export CSV' }));

    expect(createObjectURL).toHaveBeenCalledOnce();
    const [blob] = createObjectURL.mock.calls[0]!;
    expect(await blob.text()).toContain('id,urlId,title');
    expect(await blob.text()).toContain('1,first-post,First Post');
    expect(await blob.text()).toContain('"tech,blog"');
    expect(click).toHaveBeenCalledOnce();
    expect(click.mock.instances[0]).toHaveProperty('download', 'posts.csv');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:posts');
  });
});
