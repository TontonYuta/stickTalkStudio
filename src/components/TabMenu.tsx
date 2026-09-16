import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store';
import { Image, Users, MessageSquare, Settings, Sparkles, Music, Wand2 } from 'lucide-react';
import { BackgroundTab } from './tabs/BackgroundTab';
import { CharacterTab } from './tabs/CharacterTab';
import { DialogTab } from './tabs/DialogTab';
import { SettingsTab } from './tabs/SettingsTab';
import { PropsTab } from './tabs/PropsTab';
import { AudioTab } from './tabs/AudioTab';
import { EffectsTab } from './tabs/EffectsTab';
import { CodeTab } from './tabs/CodeTab';
import { Code } from 'lucide-react';

export const TabMenu = () => {
  const [activeTab, setActiveTab] = useState<'bg' | 'char' | 'dialog' | 'prop' | 'settings' | 'audio' | 'effects' | 'code'>('char');
  const { 
    project,
    selectedElementId,
  } = useEditorStore();

  const selectedChar = project.characters.find(c => c.id === selectedElementId);
  const selectedDialog = project.dialogBlocks.find(d => d.id === selectedElementId);
  const selectedProp = project.props.find(p => p.id === selectedElementId);
  const selectedAudio = project.audios.find(a => a.id === selectedElementId);

  useEffect(() => {
    if (selectedChar) setActiveTab('char');
    else if (selectedDialog) setActiveTab('dialog');
    else if (selectedProp) setActiveTab('prop');
    else if (selectedAudio) setActiveTab('audio');
  }, [selectedElementId]);

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 p-2 gap-2 overflow-x-auto bg-gray-50 shrink-0 custom-scrollbar">
        <button onClick={() => setActiveTab('bg')} className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 shrink-0 ${activeTab === 'bg' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Image size={18} />
          <span className="text-sm">Nền</span>
        </button>
        <button onClick={() => setActiveTab('char')} className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 shrink-0 ${activeTab === 'char' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Users size={18} />
          <span className="text-sm">Nhân vật</span>
        </button>
        <button onClick={() => setActiveTab('dialog')} className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 shrink-0 ${activeTab === 'dialog' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <MessageSquare size={18} />
          <span className="text-sm">Thoại</span>
        </button>
        <button onClick={() => setActiveTab('prop')} className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 shrink-0 ${activeTab === 'prop' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Sparkles size={18} />
          <span className="text-sm">Đạo cụ</span>
        </button>
        <button onClick={() => setActiveTab('audio')} className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 shrink-0 ${activeTab === 'audio' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Music size={18} />
          <span className="text-sm">Âm thanh</span>
        </button>
        <button onClick={() => setActiveTab('effects')} className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 shrink-0 ${activeTab === 'effects' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Wand2 size={18} />
          <span className="text-sm">Hiệu ứng</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 shrink-0 ${activeTab === 'settings' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Settings size={18} />
          <span className="text-sm">Cài đặt</span>
        </button>
        <button onClick={() => setActiveTab('code')} className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 shrink-0 ${activeTab === 'code' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Code size={18} />
          <span className="text-sm">Code</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'bg' && <BackgroundTab />}
        {activeTab === 'char' && <CharacterTab setActiveTab={setActiveTab} />}
        {activeTab === 'dialog' && <DialogTab />}
        {activeTab === 'prop' && <PropsTab />}
        {activeTab === 'audio' && <AudioTab />}
        {activeTab === 'effects' && <EffectsTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'code' && <CodeTab />}
      </div>
    </div>
  );
};


