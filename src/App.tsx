import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PlaylistInput } from './components/PlaylistInput';
import { RecentPlaylists } from './components/RecentPlaylists';
import { QualityFilter } from './components/QualityFilter';
import { EpisodeCard } from './components/EpisodeCard';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';
import { fetchPlaylistFromApi } from './services/api';
import { Episode, QualityType, RecentPlaylist } from './types';

export default function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Recent playlists history from localStorage
  const [recentPlaylists, setRecentPlaylists] = useState<RecentPlaylist[]>(() => {
    try {
      const saved = localStorage.getItem('aparat_recent_playlists');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse recent playlists:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('aparat_recent_playlists', JSON.stringify(recentPlaylists));
    } catch (e) {
      console.error('Failed to save recent playlists:', e);
    }
  }, [recentPlaylists]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<QualityType>('720p');
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Main Handler to fetch playlist data
  const handleFetchPlaylist = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchPlaylistFromApi(targetUrl);

      setPlaylistTitle(data.playlistTitle || 'پلی‌لیست آپارات');
      setEpisodes(data.episodes || []);

      // Add to recent playlists history if unique
      if (data.playlistTitle) {
        setRecentPlaylists((prev) => {
          const filtered = prev.filter((p) => p.url.trim() !== targetUrl.trim());
          return [{ url: targetUrl.trim(), title: data.playlistTitle }, ...filtered].slice(0, 8);
        });
      }
    } catch (err: any) {
      console.error('Error fetching playlist:', err);
      setErrorMessage(err.message || 'خطایی در دریافت اطلاعات پلی‌لیست رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchPlaylist(playlistUrl);
  };

  const handleSelectRecentPlaylist = (url: string) => {
    setPlaylistUrl(url);
    handleFetchPlaylist(url);
  };

  const handleClearHistory = () => {
    setRecentPlaylists([]);
    try {
      localStorage.removeItem('aparat_recent_playlists');
    } catch (e) {
      console.error('Failed to clear localStorage history:', e);
    }
  };

  // Filter episodes by search term
  const filteredEpisodes = useMemo(() => {
    if (!searchTerm.trim()) return episodes;
    const term = searchTerm.toLowerCase();
    return episodes.filter((ep) => {
      const indexStr = String(ep.index).toLowerCase();
      const titleStr = ep.title.toLowerCase();
      return indexStr.includes(term) || titleStr.includes(term);
    });
  }, [episodes, searchTerm]);

  // Copy single video link
  const handleCopyLink = (link: string, uid: string) => {
    if (link === 'N/A') return;
    navigator.clipboard.writeText(link);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Copy all links as plain text block
  const handleCopyAllLinks = () => {
    const validLinks = filteredEpisodes
      .map((ep) => ep.all_qualities[selectedQuality] || ep.link_720p || ep.selected_link)
      .filter((link) => link && link !== 'N/A');

    if (validLinks.length === 0) return;

    navigator.clipboard.writeText(validLinks.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Helpers for formatting filenames
  const padIndex = (index: string | number, totalCount: number) => {
    const num = Number(index);
    if (isNaN(num)) return String(index);
    const digits = totalCount >= 100 ? 3 : 2;
    return String(num).padStart(digits, '0');
  };

  const sanitizeFilename = (name: string) => {
    return name.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
  };

  // 1. Download IDM .ef2 export file containing video titles & ordered numbers
  const handleDownloadEF2ForIDM = () => {
    const total = episodes.length;
    const validEntries = episodes
      .map((ep) => {
        const link = ep.all_qualities[selectedQuality] || ep.link_720p || ep.selected_link;
        if (!link || link === 'N/A') return null;
        const idxStr = padIndex(ep.index, total);
        const cleanTitle = sanitizeFilename(ep.title);
        const fileName = `${idxStr} - ${cleanTitle}.mp4`;
        
        // IDM EF2 parameters for custom file names:
        // 'file' and 'filepath' are used by IDM when parsing exported queue items
        return `<\r\n${link}\r\nfile=${fileName}\r\nfile_name=${fileName}\r\nout_file=${fileName}\r\n>`;
      })
      .filter(Boolean);

    if (validEntries.length === 0) return;

    // CRITICAL: IDM .ef2 parser requires '<' as the very first character of the file.
    const fileContent = validEntries.join('\r\n') + '\r\n';
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.href = url;

    const sanitizedTitle = sanitizeFilename(playlistTitle || 'aparat_playlist');
    linkElement.download = `${sanitizedTitle}_${selectedQuality}.ef2`;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  // 2. IDM Batch Script (.bat) calling idman.exe directly with /f parameter
  const handleDownloadIDMBatScript = () => {
    const total = episodes.length;
    const lines = [
      '@echo off',
      'chcp 65001 > nul',
      'echo ===================================================',
      `echo Adding playlist to IDM: ${playlistTitle || 'Aparat Playlist'}`,
      'echo ===================================================',
      'echo.',
      'rem Locate IDM executable',
      'set "IDM_PATH=C:\\Program Files (x86)\\Internet Download Manager\\idman.exe"',
      'if not exist "%IDM_PATH%" set "IDM_PATH=C:\\Program Files\\Internet Download Manager\\idman.exe"',
      '',
      'if not exist "%IDM_PATH%" (',
      '  echo ERROR: IDM is not installed in standard directory!',
      '  pause',
      '  exit /b',
      ')',
      '',
    ];

    episodes.forEach((ep) => {
      const link = ep.all_qualities[selectedQuality] || ep.link_720p || ep.selected_link;
      if (link && link !== 'N/A') {
        const idxStr = padIndex(ep.index, total);
        const cleanTitle = sanitizeFilename(ep.title);
        const fileName = `${idxStr} - ${cleanTitle}.mp4`;
        lines.push(`echo Adding: ${fileName}`);
        lines.push(`"%IDM_PATH%" /d "${link}" /f "${fileName}" /a`);
      }
    });

    lines.push('');
    lines.push('echo.',);
    lines.push('echo ===================================================');
    lines.push('echo All videos successfully added to IDM download queue!');
    lines.push('echo Open IDM and start the queue download.');
    lines.push('echo ===================================================');
    lines.push('pause');

    const fileContent = lines.join('\r\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.href = url;

    const sanitizedTitle = sanitizeFilename(playlistTitle || 'aparat_playlist');
    linkElement.download = `Add_To_IDM_${sanitizedTitle}_${selectedQuality}.bat`;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  // 3. Download Windows Batch script (.bat) for automatic curl downloads with names
  const handleDownloadBatScript = () => {
    const total = episodes.length;
    const lines = [
      '@echo off',
      'chcp 65001 > nul',
      `echo Starting download for playlist: ${playlistTitle || 'Aparat Playlist'}`,
      'echo.',
    ];

    episodes.forEach((ep) => {
      const link = ep.all_qualities[selectedQuality] || ep.link_720p || ep.selected_link;
      if (link && link !== 'N/A') {
        const idxStr = padIndex(ep.index, total);
        const cleanTitle = sanitizeFilename(ep.title);
        const fileName = `${idxStr} - ${cleanTitle}.mp4`;
        lines.push(`echo Downloading: ${fileName}`);
        lines.push(`curl -L -o "${fileName}" "${link}"`);
        lines.push('echo.');
      }
    });

    lines.push('echo All downloads finished!');
    lines.push('pause');

    const fileContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.href = url;

    const sanitizedTitle = sanitizeFilename(playlistTitle || 'aparat_playlist');
    linkElement.download = `${sanitizedTitle}_${selectedQuality}.bat`;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  // 3. Download plain TXT file
  const handleDownloadTxtForIDM = () => {
    const validLinks = episodes
      .map((ep) => ep.all_qualities[selectedQuality] || ep.link_720p || ep.selected_link)
      .filter((link) => link && link !== 'N/A');

    if (validLinks.length === 0) return;

    const fileContent = '\uFEFF' + validLinks.join('\r\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.href = url;

    const sanitizedTitle = sanitizeFilename(playlistTitle || 'aparat_playlist');
    linkElement.download = `${sanitizedTitle}_${selectedQuality}.txt`;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 w-full flex-1">
        {/* Header */}
        <Header />

        {/* Search & URL Input */}
        <PlaylistInput
          url={playlistUrl}
          onChangeUrl={setPlaylistUrl}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onSampleClick={(sampleUrl) => {
            setPlaylistUrl(sampleUrl);
            handleFetchPlaylist(sampleUrl);
          }}
        />

        {/* History of recent playlists */}
        <RecentPlaylists
          recentPlaylists={recentPlaylists}
          currentUrl={playlistUrl}
          onSelectPlaylist={handleSelectRecentPlaylist}
          onClearHistory={handleClearHistory}
          isLoading={isLoading}
        />

        {/* Playlist Content view */}
        {episodes.length > 0 ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Playlist Title Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:px-6">
              <div>
                <span className="text-xs text-rose-400 font-semibold block mb-0.5">پلی‌لیست انتخاب شده:</span>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">{playlistTitle}</h2>
              </div>
              <div className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700/60 shrink-0">
                {episodes.length} قسمت
              </div>
            </div>

            {/* Quality Filter & Search */}
            <QualityFilter
              selectedQuality={selectedQuality}
              onChangeQuality={setSelectedQuality}
              searchTerm={searchTerm}
              onChangeSearchTerm={setSearchTerm}
              onCopyAll={handleCopyAllLinks}
              copiedAll={copiedAll}
              onDownloadEF2={handleDownloadEF2ForIDM}
              onDownloadIDMBat={handleDownloadIDMBatScript}
              onDownloadBat={handleDownloadBatScript}
              onDownloadTxt={handleDownloadTxtForIDM}
              totalEpisodes={filteredEpisodes.length}
            />

            {/* Episode List */}
            <div className="space-y-3">
              {filteredEpisodes.map((episode) => (
                <EpisodeCard
                  key={episode.uid}
                  episode={episode}
                  selectedQuality={selectedQuality}
                  copiedUid={copiedUid}
                  onCopyLink={handleCopyLink}
                />
              ))}

              {filteredEpisodes.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs">
                  هیچ قسمتی با عبارت "{searchTerm}" پیدا نشد.
                </div>
              )}
            </div>
          </div>
        ) : (
          !isLoading && (
            <EmptyState
              onSampleClick={(sampleUrl) => {
                setPlaylistUrl(sampleUrl);
                handleFetchPlaylist(sampleUrl);
              }}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
