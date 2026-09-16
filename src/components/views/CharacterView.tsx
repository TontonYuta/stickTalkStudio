import React from 'react';
import { Character, DialogBlock } from '../../types';
import { getAnimationStyles } from '../../utils/animation';
import { useEditorStore } from '../../store';

interface CharacterViewProps {
  character: Character;
  isSelected: boolean;
  isSpeaking: boolean;
  emotion?: DialogBlock['emotion'];
  currentTime: number;
  onPointerDown: (e: React.PointerEvent) => void;
}

export const CharacterView: React.FC<CharacterViewProps> = ({ character, isSelected, isSpeaking, emotion, currentTime, onPointerDown }) => {
  const baseArmL = character.pose?.armL ?? 20;
  const baseArmR = character.pose?.armR ?? -30;
  const baseLegL = character.pose?.legL ?? 10;
  const baseLegR = character.pose?.legR ?? -10;
  const baseBodyLean = character.pose?.bodyLean ?? 0;
  const baseHeadTilt = character.pose?.headTilt ?? 0;
  const strokeColor = character.color || '#0f172a';
  
  const appearance = character.appearance || {
    skinColor: '#ffedd5',
    hairColor: '#1e293b',
    hairStyle: 'short',
    shirtColor: '#2563eb',
    pantsColor: '#1e293b',
    accessory: 'none'
  };
  
  const skinColor = appearance.skinColor !== 'transparent' ? appearance.skinColor : '#ffedd5';
  const shirtColor = appearance.shirtColor || '#2563eb';
  const pantsColor = appearance.pantsColor || '#1e293b';
  
  const outfitStyle = appearance.outfitStyle || (character.type === 'teacher' ? 'formal' : 'casual');
  const hasTie = appearance.hasTie ?? (outfitStyle === 'formal');
  const tieColor = appearance.tieColor || '#dc2626';
  const hasBelt = appearance.hasBelt !== false;
  const beltColor = appearance.beltColor || '#1e1b4b';
  const hasPocketPen = appearance.hasPocketPen ?? (character.type === 'teacher' || outfitStyle === 'formal');
  const shoeColor = appearance.shoeColor || '#090d16';

  const animStyles = getAnimationStyles(character, currentTime);
  const isExporting = useEditorStore(s => s.isExporting);

  // Time & Seed
  const t = currentTime;
  const charSeed = (character.id.charCodeAt(character.id.length - 1) || 0) * 0.7;

  // DIGNIFIED & POISED GESTURES (Không ngọ nguậy, không rung lắc thừa thãi)
  // Giữ tư thế đĩnh đạc, vững chãi, chỉ nhấn nhá nhẹ nhàng có chủ đích
  let bodyLeanOffset = 0;
  let headTiltOffset = 0;
  let headBobY = 0;

  // Subtle breathing (Chỉ thở cực kỳ khẽ, vô cùng tự nhiên và lịch thiệp)
  const subtleBreath = Math.sin((t + charSeed) * 1.6) * 0.4;
  headBobY = subtleBreath;

  if (isSpeaking) {
    // When speaking: Stately, controlled presence without manic bobbing
    switch (emotion) {
      case 'angry':
        bodyLeanOffset = 2.0;
        headTiltOffset = 1.0;
        break;
      case 'happy':
      case 'laughing':
        bodyLeanOffset = 1.0;
        headTiltOffset = 2.0;
        break;
      case 'surprised':
        bodyLeanOffset = -2.5;
        headTiltOffset = -1.5;
        break;
      case 'questioning':
        bodyLeanOffset = 0.5;
        headTiltOffset = 5.0; // Inquisitive head tilt
        break;
      case 'sad':
      case 'crying':
        bodyLeanOffset = 2.0;
        headTiltOffset = 1.5;
        break;
      case 'explaining':
      default:
        bodyLeanOffset = 1.5; // Slight forward engagement
        headTiltOffset = 1.0;
        break;
    }
  }

  const totalBodyLean = baseBodyLean + bodyLeanOffset;
  const totalHeadTilt = baseHeadTilt + headTiltOffset;
  const armL = baseArmL;
  const armR = baseArmR;
  const legL = baseLegL;
  const legR = baseLegR;

  // Natural Blinking Cycle (Nhắm mắt nhẹ nhàng mỗi 3.8s)
  const blinkCycle = (t + charSeed * 1.5) % 3.8;
  const isBlinking = blinkCycle < 0.14;

  // Controlled, Polite Lip-Sync (Khẩu hình vừa phải, thanh lịch)
  const mouthOpen = isSpeaking ? (2.0 + Math.abs(Math.sin(t * 9.0) * 2.8)) : 0;

  // Multi-segment Arm calculation with Tailored Sleeves, Cuffs, and Expressive Hands
  const renderArm = (angleDeg: number, isLeft: boolean) => {
    const upperLen = 25;
    const lowerLen = 23;
    // Anatomic Shoulder Anchors: left shoulder at (41, 80), right shoulder at (59, 80)
    const shoulderX = isLeft ? 41 : 59;
    const shoulderY = 80;
    const rad1 = (angleDeg * Math.PI) / 180;
    const elbowX = shoulderX + upperLen * Math.sin(rad1);
    const elbowY = shoulderY + upperLen * Math.cos(rad1);

    // Natural, refined elbow bend proportional to arm angle
    let elbowBend = 0;
    if (angleDeg < -20) {
      const factor = Math.min(1, Math.abs(angleDeg + 20) / 75);
      elbowBend = (isLeft ? -24 : 24) * factor;
    } else if (angleDeg > 30) {
      const factor = Math.min(1, (angleDeg - 30) / 50);
      elbowBend = (isLeft ? 20 : -20) * factor;
    } else {
      // Subtle natural resting micro-bend
      elbowBend = isLeft ? -6 : 6;
    }

    const rad2 = ((angleDeg + elbowBend) * Math.PI) / 180;
    const wristX = elbowX + lowerLen * Math.sin(rad2);
    const wristY = elbowY + lowerLen * Math.cos(rad2);

    // Purposeful hand poses
    const isPointing = angleDeg < -55; // Presentation pointer
    const isWelcoming = angleDeg >= -55 && angleDeg < -15; // Open explaining palm

    return (
      <g key={isLeft ? 'arm-l' : 'arm-r'}>
        {/* Upper Arm with Tailored Sleeve */}
        <line x1={shoulderX} y1={shoulderY} x2={elbowX} y2={elbowY} stroke={strokeColor} strokeWidth="6.5" strokeLinecap="round" />
        <line x1={shoulderX} y1={shoulderY} x2={elbowX} y2={elbowY} stroke={skinColor} strokeWidth="3.5" strokeLinecap="round" />
        
        {shirtColor !== 'transparent' && (
          <line x1={shoulderX} y1={shoulderY} x2={shoulderX + 16 * Math.sin(rad1)} y2={shoulderY + 16 * Math.cos(rad1)} stroke={shirtColor} strokeWidth="7.5" strokeLinecap="round" />
        )}
        
        {/* Elbow Joint (Clean hinge) */}
        <circle cx={elbowX} cy={elbowY} r="2.8" fill={strokeColor} />

        {/* Forearm */}
        <line x1={elbowX} y1={elbowY} x2={wristX} y2={wristY} stroke={strokeColor} strokeWidth="5.5" strokeLinecap="round" />
        <line x1={elbowX} y1={elbowY} x2={wristX} y2={wristY} stroke={skinColor} strokeWidth="3" strokeLinecap="round" />

        {/* Shirt Cuff (Cổ tay áo sơ mi tinh tế) */}
        {shirtColor !== 'transparent' && (
          <g transform={`translate(${wristX - 3 * Math.sin(rad2)}, ${wristY - 3 * Math.cos(rad2)}) rotate(${angleDeg + elbowBend})`}>
            <rect x="-3.5" y="-1.5" width="7" height="3" rx="1" fill="#ffffff" stroke={strokeColor} strokeWidth="1" />
          </g>
        )}

        {/* Polished Hand Gestures */}
        {isPointing ? (
          // Elegant Presentation Pointer (Ngón trỏ hướng về bảng/đồ thị)
          <g transform={`translate(${wristX}, ${wristY}) rotate(${angleDeg + elbowBend})`}>
            <circle cx="0" cy="0" r="3.5" fill={skinColor} stroke={strokeColor} strokeWidth="1.6" />
            <line x1="0" y1="0" x2="0" y2="7" stroke={strokeColor} strokeWidth="2.4" strokeLinecap="round" />
            <line x1="0" y1="0" x2="0" y2="7" stroke={skinColor} strokeWidth="1.4" strokeLinecap="round" />
          </g>
        ) : isWelcoming ? (
          // Welcoming Open Palm (Lòng bàn tay mở thanh lịch đón nhận ý kiến)
          <g transform={`translate(${wristX}, ${wristY}) rotate(${angleDeg + elbowBend - 15})`}>
            <ellipse cx="0" cy="1" rx="3.8" ry="4.5" fill={skinColor} stroke={strokeColor} strokeWidth="1.6" />
            <line x1="-1.5" y1="2" x2="-1.5" y2="6.5" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1" y1="2" x2="1" y2="6.5" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ) : (
          // Natural Poised Hand (Bàn tay nắm nhẹ tự nhiên bên hông)
          <g transform={`translate(${wristX}, ${wristY})`}>
            <circle cx="0" cy="0" r="3.8" fill={skinColor} stroke={strokeColor} strokeWidth="1.8" />
            <path d="M -1.8 0 Q 0 1.5 1.8 0" stroke={strokeColor} strokeWidth="1" fill="none" />
          </g>
        )}
      </g>
    );
  };

  // Multi-segment Leg calculation with Creased Trousers and Grounded Leather Shoes
  const renderLeg = (angleDeg: number, isLeft: boolean) => {
    const upperLen = 32;
    const lowerLen = 32;
    // Anatomic Pelvis Hips: Left hip at 43, Right hip at 57, y = 120
    const hipX = isLeft ? 43 : 57;
    const hipY = 120;
    const rad1 = (angleDeg * Math.PI) / 180;
    
    // Counter-rotate knee to keep stance natural and foot grounded flat
    let kneeBend = 0;
    if (Math.abs(angleDeg) > 4) {
      kneeBend = -angleDeg * 0.65;
    }
    const rad2 = ((angleDeg + kneeBend) * Math.PI) / 180;

    const kneeX = hipX + upperLen * Math.sin(rad1);
    const kneeY = hipY + upperLen * Math.cos(rad1);

    const footX = kneeX + lowerLen * Math.sin(rad2);
    // Plant feet firmly on the ground plane (shadow at y=186)
    const footY = Math.min(185, kneeY + lowerLen * Math.cos(rad2));

    // When standing (small angle), keep shoes horizontal on the ground
    const shoeRotation = Math.abs(angleDeg) < 30 ? 0 : (angleDeg + kneeBend);

    return (
      <g key={isLeft ? 'leg-l' : 'leg-r'}>
        {/* Upper Leg with Straight-cut Trouser */}
        <line x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} stroke={strokeColor} strokeWidth="8" strokeLinecap="round" />
        <line x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} stroke={skinColor} strokeWidth="4" strokeLinecap="round" />
        {pantsColor !== 'transparent' && (
          <line x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} stroke={pantsColor} strokeWidth="8" strokeLinecap="round" />
        )}

        {/* Knee Joint */}
        <circle cx={kneeX} cy={kneeY} r="3" fill={strokeColor} />

        {/* Lower Leg with Trouser Crease */}
        <line x1={kneeX} y1={kneeY} x2={footX} y2={footY} stroke={strokeColor} strokeWidth="7" strokeLinecap="round" />
        <line x1={kneeX} y1={kneeY} x2={footX} y2={footY} stroke={skinColor} strokeWidth="3.5" strokeLinecap="round" />
        {pantsColor !== 'transparent' && (
          <g>
            <line x1={kneeX} y1={kneeY} x2={footX} y2={footY} stroke={pantsColor} strokeWidth="7" strokeLinecap="round" />
            {/* Elegant Trouser Crease Line (Đường ủi li quần đứng dáng) */}
            <line x1={kneeX} y1={kneeY + 2} x2={footX} y2={footY - 2} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
          </g>
        )}

        {/* Polished Leather Shoes (Giày da công sở có viền đế & đặt phẳng trên mặt sàn) */}
        <g transform={`translate(${footX}, ${footY}) rotate(${shoeRotation})`}>
          {/* Shoe Sole */}
          <ellipse cx="2" cy="1" rx="8" ry="4" fill={shoeColor} stroke={strokeColor} strokeWidth="1.5" />
          {/* Sole Edge */}
          <line x1="-6" y1="3.5" x2="10" y2="3.5" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
          {/* Shoe Shine Highlight (Vết bóng sáng trên mũi giày) */}
          <line x1="3" y1="-1.5" x2="8" y2="-0.5" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" />
        </g>
      </g>
    );
  };

  return (
    <div 
      className={`absolute cursor-grab active:cursor-grabbing ${isExporting ? '' : 'transition-transform duration-75'} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent rounded-2xl z-20 bg-black/5' : 'hover:ring-2 hover:ring-gray-300 hover:rounded-2xl z-10'}`}
      style={{
        ...animStyles,
        left: `${character.x}%`,
        top: `${character.y}%`,
        transform: `${animStyles.transform} scale(${character.scale}) rotate(${character.rotation || 0}deg)`,
        touchAction: 'none',
        width: '120px',
        height: '220px',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onPointerDown={onPointerDown}
    >
      {/* Puppet Visual Body */}
      <div 
        className="w-[110px] h-[210px] flex items-center justify-center pointer-events-none"
        style={{
          transform: character.flipX ? 'scaleX(-1)' : undefined,
          transformOrigin: '50% 50%'
        }}
      >
        {character.imageUrl ? (
          <img 
            src={character.imageUrl} 
            alt="Character" 
            className="max-w-full max-h-full object-contain pointer-events-none" 
          />
        ) : (
          <svg width="110" height="210" viewBox="0 0 110 210" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none overflow-visible">
            <defs>
              <radialGradient id={`shadow-${character.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Stable Ground Shadow (Tiếp đất vững chắc) */}
            <ellipse 
              cx="50" 
              cy="186" 
              rx="38" 
              ry="5.5" 
              fill={`url(#shadow-${character.id})`} 
            />

            {/* Legs (Anchored at Hip 50, 120) */}
            <g>
              {renderLeg(legL, true)}
              {renderLeg(legR, false)}
            </g>

            {/* Articulated Torso with Subtle Dignified Posture around Hip (50, 120) */}
            <g transform={`rotate(${totalBodyLean} 50 120)`}>
              {/* Back Arm (Arm R) */}
              {renderArm(armR, false)}

              {/* Main Torso & Tailored Clothes */}
              <g>
                {/* Torso Spine Bone */}
                <line x1="50" y1="78" x2="50" y2="120" stroke={strokeColor} strokeWidth="11" strokeLinecap="round" />
                <line x1="50" y1="78" x2="50" y2="120" stroke={skinColor} strokeWidth="6" strokeLinecap="round" />
                
                {/* Tailored Shirt / Vest / Polo Body */}
                {shirtColor !== 'transparent' && (
                  <g>
                    {/* Shirt Fabric Contour */}
                    <path 
                      d="M 40 78 L 60 78 L 61 118 L 39 118 Z" 
                      fill={shirtColor} 
                      stroke={strokeColor} 
                      strokeWidth="3.2" 
                      strokeLinejoin="round" 
                    />

                    {/* White Shirt Collar Lapels (Cổ áo sơ mi trắng lịch sự) */}
                    <polygon points="41,78 48,87 46,78" fill="#ffffff" stroke={strokeColor} strokeWidth="1.2" />
                    <polygon points="59,78 52,87 54,78" fill="#ffffff" stroke={strokeColor} strokeWidth="1.2" />

                    {/* Necktie (Cà vạt sang trọng) or Buttons */}
                    {hasTie ? (
                      <g>
                        {/* Tie Knot */}
                        <polygon points="48,79 52,79 53,83 47,83" fill={tieColor} stroke={strokeColor} strokeWidth="1" />
                        {/* Tie Body */}
                        <polygon points="48,83 52,83 53,108 50,113 47,108" fill={tieColor} stroke={strokeColor} strokeWidth="1.2" />
                      </g>
                    ) : (
                      // Pearl Shirt Buttons (3 cúc áo sơ mi tinh tế)
                      <g fill="#ffffff" stroke={strokeColor} strokeWidth="0.8">
                        <line x1="50" y1="78" x2="50" y2="116" stroke={strokeColor} strokeWidth="1" strokeDasharray="1 2" opacity="0.6" />
                        <circle cx="50" cy="88" r="1.2" />
                        <circle cx="50" cy="98" r="1.2" />
                        <circle cx="50" cy="108" r="1.2" />
                      </g>
                    )}

                    {/* Breast Pocket with Gilded Pen (Túi áo ngực gài bút bi chuyên gia) */}
                    {hasPocketPen && (
                      <g>
                        <rect x="42" y="90" width="6" height="7" rx="1" fill="#ffffff" fillOpacity="0.18" stroke={strokeColor} strokeWidth="1" />
                        {/* Pen Clip */}
                        <line x1="45" y1="88" x2="45" y2="93" stroke="#eab308" strokeWidth="1.4" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Leather Belt & Metallic Buckle (Thắt lưng da & Khóa kim loại chuẩn form) */}
                    {hasBelt && (
                      <g>
                        <rect x="39" y="117" width="22" height="4.5" fill={beltColor} stroke={strokeColor} strokeWidth="1.2" />
                        {/* Metallic Buckle */}
                        <rect x="48" y="116.5" width="4.5" height="5.5" rx="1" fill="#fbbf24" stroke={strokeColor} strokeWidth="1" />
                        <rect x="49.2" y="118" width="2.1" height="2.5" fill={beltColor} />
                      </g>
                    )}
                  </g>
                )}

                {/* Neck */}
                <line x1="50" y1="68" x2="50" y2="80" stroke={strokeColor} strokeWidth="6.5" strokeLinecap="round" />
                <line x1="50" y1="68" x2="50" y2="80" stroke={skinColor} strokeWidth="3.5" strokeLinecap="round" />
              </g>

              {/* Front Arm (Arm L) */}
              {renderArm(armL, true)}

              {/* Hair Back */}
              {appearance.hairStyle === 'long' && (
                <path d="M 30 45 Q 26 92 18 102 L 82 102 Q 74 92 70 45 Z" fill={appearance.hairColor} stroke={strokeColor} strokeWidth="2" />
              )}

              {/* Articulated Head & Face with Subtle Dignified Tilt around Neck (50, 72) */}
              <g transform={`translate(0, ${headBobY}) rotate(${totalHeadTilt} 50 72)`}>
                {/* Head Base */}
                <circle cx="50" cy="45" r="28" fill={skinColor} stroke={strokeColor} strokeWidth="3.6" />
                
                {/* Cheeks - Subtle refined touch */}
                <ellipse cx="36" cy="51" rx="4" ry="2.2" fill="#f43f5e" fillOpacity="0.22" />
                <ellipse cx="64" cy="51" rx="4" ry="2.2" fill="#f43f5e" fillOpacity="0.22" />

                {/* Eyes & Eyebrows with Biological Blinking & Catchlight Glint */}
                {isBlinking ? (
                  // Polite Eyelash Blink
                  <g>
                    <path d="M 35 46 Q 39 48.5 43 46" stroke={strokeColor} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <path d="M 57 46 Q 61 48.5 65 46" stroke={strokeColor} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                  </g>
                ) : (
                  (() => {
                    switch (emotion) {
                      case 'angry':
                        return (
                          <g>
                            <line x1="33" y1="37" x2="43" y2="40" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                            <line x1="67" y1="37" x2="57" y2="40" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                            <circle cx="39" cy="45" r="3.4" fill={strokeColor} />
                            <circle cx="38" cy="44" r="1.1" fill="#ffffff" />
                            <circle cx="61" cy="45" r="3.4" fill={strokeColor} />
                            <circle cx="60" cy="44" r="1.1" fill="#ffffff" />
                          </g>
                        );
                      case 'happy':
                      case 'laughing':
                        return (
                          <g>
                            <path d="M 34 45 Q 39 38 44 45" stroke={strokeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                            <path d="M 56 45 Q 61 38 66 45" stroke={strokeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                            <path d="M 34 36 Q 39 34 44 36" stroke={strokeColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                            <path d="M 56 36 Q 61 34 66 36" stroke={strokeColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                          </g>
                        );
                      case 'surprised':
                        return (
                          <g>
                            <circle cx="39" cy="43" r="4.6" fill={strokeColor} />
                            <circle cx="37.5" cy="41.5" r="1.6" fill="#ffffff" />
                            <circle cx="61" cy="43" r="4.6" fill={strokeColor} />
                            <circle cx="59.5" cy="41.5" r="1.6" fill="#ffffff" />
                            <path d="M 35 33 Q 39 30 43 33" stroke={strokeColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
                            <path d="M 57 33 Q 61 30 65 33" stroke={strokeColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
                          </g>
                        );
                      case 'questioning':
                        return (
                          <g>
                            <path d="M 35 38 Q 39 36 43 38" stroke={strokeColor} strokeWidth="2" fill="none" strokeLinecap="round" />
                            <path d="M 57 34 Q 61 30 65 34" stroke={strokeColor} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                            <circle cx="39" cy="45" r="3.5" fill={strokeColor} />
                            <circle cx="38" cy="44" r="1.1" fill="#ffffff" />
                            <circle cx="61" cy="45" r="3.5" fill={strokeColor} />
                            <circle cx="60" cy="44" r="1.1" fill="#ffffff" />
                          </g>
                        );
                      default:
                        return (
                          <g>
                            {/* Intellectual, Calm, Clear Eyes */}
                            <path d="M 35 37 Q 39 35 43 37" stroke={strokeColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                            <path d="M 57 37 Q 61 35 65 37" stroke={strokeColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                            <circle cx="39" cy="45" r="3.5" fill={strokeColor} />
                            <circle cx="37.8" cy="43.8" r="1.2" fill="#ffffff" />
                            <circle cx="61" cy="45" r="3.5" fill={strokeColor} />
                            <circle cx="59.8" cy="43.8" r="1.2" fill="#ffffff" />
                          </g>
                        );
                    }
                  })()
                )}

                {/* Controlled, Polite Mouth (Khẩu hình vừa vặn, không ngoác miệng) */}
                {isSpeaking ? (
                  <g transform="translate(50, 58)">
                    <ellipse cx="0" cy="0" rx="5.2" ry={mouthOpen} fill={strokeColor} />
                  </g>
                ) : (
                  (() => {
                    switch (emotion) {
                      case 'happy':
                      case 'laughing':
                        return <path d="M 43 56 Q 50 62 57 56" stroke={strokeColor} strokeWidth="2.4" fill="none" strokeLinecap="round" />;
                      case 'angry':
                      case 'sad':
                        return <path d="M 44 60 Q 50 56 56 60" stroke={strokeColor} strokeWidth="2.4" fill="none" strokeLinecap="round" />;
                      case 'surprised':
                        return <ellipse cx="50" cy="58" rx="3.2" ry="4.2" fill={strokeColor} />;
                      default:
                        return <path d="M 44 56 Q 50 59.5 56 56" stroke={strokeColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />;
                    }
                  })()
                )}

                {/* Hair Front Styles */}
                {appearance.hairStyle === 'short' && (
                  <path d="M 20 44 C 20 13, 80 13, 80 44 C 80 54, 65 31, 50 31 C 35 31, 20 54, 20 44 Z" fill={appearance.hairColor} />
                )}
                {appearance.hairStyle === 'spiky' && (
                  <path d="M 23 45 L 21 27 L 33 31 L 39 18 L 48 27 L 56 16 L 64 27 L 73 20 L 77 33 L 79 45 Z" fill={appearance.hairColor} />
                )}
                {appearance.hairStyle === 'curly' && (
                  <g fill={appearance.hairColor}>
                    <circle cx="26" cy="35" r="9" />
                    <circle cx="38" cy="23" r="11" />
                    <circle cx="50" cy="19" r="12" />
                    <circle cx="62" cy="23" r="11" />
                    <circle cx="74" cy="35" r="9" />
                  </g>
                )}
                {appearance.hairStyle === 'bun' && (
                  <g fill={appearance.hairColor}>
                    <path d="M 23 45 C 23 21, 77 21, 77 45 Z" />
                    <circle cx="50" cy="15" r="13" />
                  </g>
                )}

                {/* Accessories */}
                {appearance.accessory === 'glasses' && (
                  <g>
                    <rect x="30" y="38" width="16" height="13" rx="3" fill="none" stroke={strokeColor} strokeWidth="2.2" />
                    <rect x="54" y="38" width="16" height="13" rx="3" fill="none" stroke={strokeColor} strokeWidth="2.2" />
                    <line x1="46" y1="44" x2="54" y2="44" stroke={strokeColor} strokeWidth="2.2" />
                    <line x1="22" y1="42" x2="30" y2="42" stroke={strokeColor} strokeWidth="2.2" />
                    <line x1="70" y1="42" x2="78" y2="42" stroke={strokeColor} strokeWidth="2.2" />
                    <line x1="33" y1="40" x2="37" y2="48" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
                    <line x1="57" y1="40" x2="61" y2="48" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
                  </g>
                )}
                {appearance.accessory === 'hat' && (
                  <g>
                    <polygon points="50,14 84,24 50,34 16,24" fill="#1e293b" stroke={strokeColor} strokeWidth="1.8" />
                    <rect x="36" y="27" width="28" height="12" fill="#1e293b" />
                    <line x1="50" y1="24" x2="80" y2="34" stroke="#eab308" strokeWidth="2" />
                    <circle cx="80" cy="35" r="2.5" fill="#eab308" />
                  </g>
                )}
                {appearance.accessory === 'cap' && (
                  <g>
                    <path d="M 24 35 Q 50 15 76 35 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="1.6" />
                    <path d="M 72 33 Q 91 33 93 37 Q 81 40 70 37 Z" fill="#b91c1c" stroke={strokeColor} strokeWidth="1.6" />
                    <circle cx="50" cy="19" r="2.2" fill="#ffffff" />
                  </g>
                )}
              </g>
            </g>
          </svg>
        )}
      </div>

      {/* Name Tag (Isolated outside scaleX to prevent mirrored text) */}
      {character.showName && character.name && (
        <div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md pointer-events-none border border-slate-700 select-none z-10"
        >
          {character.name}
        </div>
      )}
    </div>
  );
};
